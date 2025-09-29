import { empty } from "@nan0web/types"
import DB from "@nan0web/db"
import event from "@nan0web/event"
import Markdown, { InterceptorInput, MDList } from "@nan0web/markdown"

import URIPattern from "./URIPattern.js"
import systemMd from "./system.md/index.js"
import App from "../../App.js"
import ChatMessage from "../../Chat/Message.js"
import Response from "../../Chat/Response.js"
import ChatContext from "../../Chat/Context.js"

export default class ChatAgent {
	static ID = "agent-base"
	static MESSAGES = {
		goodbye: ["", "🙏 Take care!", ""],
	}
	static SYSTEM_MD = systemMd
	static LOOP_DEFAULTS = {
		maxLoops: Number.MAX_SAFE_INTEGER,
	}

	/** @type {string[]} */
	inputPipeline = [
		"mightBeIncludes",
	]
	/** @type {string[]} */
	outputPipeline = []
	/** @type {string} */
	name = "Base Agent v1"
	/** @type {string} */
	desc = "Base agent with optional loop; extend for multi-turn tasks"
	/** @type {App} */
	app
	/** @type {DB} */
	db
	/** @type {DB} */
	fs

	constructor(props = {}) {
		this.bus = event()
		const { inputPipeline, outputPipeline, name, desc, app = new App(), db, fs } = props
		this.inputPipeline = inputPipeline || this.inputPipeline
		this.outputPipeline = outputPipeline || this.outputPipeline
		this.name = name || this.name
		this.desc = desc || this.desc
		this.app = app
		this.db = db
		this.fs = fs
	}

	/** @returns {string} */
	get SYSTEM_MD() {
		return /** @type {typeof ChatAgent} */ (this.constructor).SYSTEM_MD
	}

	// Core: run() with loop
	async run(
		context = new ChatContext(),
		loopOpts = {
			/**
			 * @param {ChatContext} context
			 * @returns {Promise<boolean>} Whether to continue chat or not.
			 */
			onStepEnd: async (context) => true
		}
	) {
		const opts = { ...ChatAgent.LOOP_DEFAULTS, ...loopOpts }

		// Setup events (per-loop)
		const driver = this.app.chatProvider.driver
		await driver.init()
		/**
		 * @type {import("@nan0web/event/types/types/index.js").EventListener}
		 */
		const onLoopStart = async (event) => {
			this.bus.emit("loop.start", { event, context })
		}
		/**
		 * @type {import("@nan0web/event/types/types/index.js").EventListener}
		 */
		const onLoopData = (event) => {
			this.bus.emit("loop.data", { event, context })
		}
		/**
		 * @type {import("@nan0web/event/types/types/index.js").EventListener}
		 */
		const onLoopEnd = (event) => {
			this.bus.emit("loop.end", { event, context })
		}
		driver.on("start", onLoopStart)
		driver.on("data", onLoopData)
		driver.on("end", onLoopEnd)

		// Optional: ESC listener (for CLI View integration)
		if (this.app.view?.onKey) {
			this.app.view.onKey("escape", () => {
				this.bus.emit("loop.cancel", context)
				context.cancel()
			})
		}

		try {
			while (
				context.loopCount < opts.maxLoops &&
				this.shouldLoop(context) &&
				!context.cancelled
			) {
				// Emit progress (e.g., "Loop 2/10")
				this.bus.emit("loop.progress", { loopCount: context.loopCount + 1, context })

				// Single-turn process
				const initialInput = this.getInputFromContext(context) // Override for custom input (e.g., tasks[0])
				const stepResult = await this.runSingleTurn(initialInput, context) // Base transform + LLM call
				if (stepResult.error) {
					this.bus.emit("loop.error", { error: stepResult.error, context })
					break // Or retry logic here
				}

				// Update context after step (append response, update tasks/status)
				await this.updateContextAfterStep(stepResult, context)

				// Check custom continue condition (override in subclasses)
				if (!this.shouldLoop(context)) {
					break
				}

				// Optional: User interaction (e.g., ask if continue)
				if (opts.onStepEnd) {
					const continueChoice = await opts.onStepEnd(context)
					if (!continueChoice) {
						context.cancel()
					}
				}
			}

			this.bus.emit("loop.complete", { finalContext: context })

			return { response: context.prevResponse, context }
		} catch (error) {
			this.bus.emit("loop.error", { error, context })
			throw error
		} finally {
			driver.off("start", onLoopStart)
			driver.off("data", onLoopData)
			driver.off("end", onLoopEnd)
		}
	}

	/**
	 * Determines if the loop should continue (hook for subclasses).
	 * @param {object} context - Current context (history, tasks, cancel, loopCount)
	 * @returns {boolean} True to continue, false to stop.
	 */
	shouldLoop(context) {
		return context.loopCount < 1
	}

	/**
	 * Builds prompt from context (e.g., system + last history).
	 * @param {object} context - Context with history array
	 * @returns {ChatMessage} Prompt for next iteration
	 */
	buildPromptFromContext(context) {
		const { history, systemPrompt = this.SYSTEM_MD } = context
		const prompt = new ChatMessage({ role: "system", content: systemPrompt })
		// Append limited history (e.g., last 5 to avoid token limit)
		history.slice(-5).forEach((msg) => prompt.add(msg))
		return prompt
	}

	/**
	 * Gets input for single-turn process (override for dynamic input, e.g., next task).
	 * @param {ChatContext} context - Current context
	 * @returns {ChatMessage} Input for LLM
	 */
	getInputFromContext(context) {
		// Default: last history message
		const recent = context.chat.recent
		if (empty(recent)) {
			throw new Error("No recent message in context")
		}
		if (![ChatMessage.ROLES.user, ChatMessage.ROLES.os].includes(recent.role)) {
			throw new Error(
				[
					"Recent message must be user-like role, but provided",
					recent.role
				].join(": ")
			)
		}
		return new ChatMessage({ role: "user", content: recent.content })
	}

	/**
	 * Runs a single iteration (transform input → LLM → transform output).
	 * @param {ChatMessage} input - Input for this turn
	 * @param {object} context - Current context
	 * @returns {Promise<{response: Response | null, error: any}>} Single response or error
	 */
	async runSingleTurn(input, context) {
		try {
			// Transform input
			const transformedInput = await this.transformInput(input, context)
			if (!(transformedInput instanceof ChatMessage)) {
				return { response: null, error: transformedInput.error }
			}

			// LLM call (using driver)
			const response = await this.app.chatProvider.driver.stream(
				transformedInput,
				this.app.chatModel,
				(delta) => {
					this.bus.emit("loop.data", { delta, context }); // Per-chunk
				}
			)

			// Transform output
			const transformedOutput = await this.transformOutput(response, context)
			if (!(transformedOutput instanceof Response)) {
				return { response: null, error: transformedOutput.error }
			}

			return { response: transformedOutput, error: null }
		} catch (/** @type {any} */ error) {
			return { response: null, error }
		}
	}

	/**
	 * Updates context after single step (append to history, e.g., tasks update).
	 * @param {object} stepResult - {response} from runSingleTurn
	 * @param {object} context - Current context (mutable)
	 */
	async updateContextAfterStep(stepResult, context) {
		if (!stepResult.error && stepResult.response) {
			context.setResponse(stepResult.response)
		}
	}

	/**
	 * Transforms input (pipeline array).
	 * @param {ChatMessage} input
	 * @param {ChatContext} context
	 * @returns {Promise<ChatMessage | {error: Error}>}
	 */
	async transformInput(input, context) {
		for (const step of this.inputPipeline) {
			const stepFn = this[step] // Assume this.stepName() exists
			if (typeof stepFn !== 'function') {
				return { error: new Error(`Pipeline step "${step}" not found`) }
			}
			const result = await stepFn(input, context)
			if (result !== true) {
				return { error: new Error(`Input pipeline "${step}" failed: ${result}`) }
			}
		}
		return input
	}

	/**
	 * Transforms output (pipeline array).
	 * @param {Response} response
	 * @param {object} context
	 * @returns {Promise<Response | {error: Error}>}
	 */
	async transformOutput(response, context) {
		for (const step of this.outputPipeline) {
			const stepFn = this[step]
			if (typeof stepFn !== 'function') {
				return { error: new Error(`Pipeline step "${step}" not found`) }
			}
			const result = await stepFn(response, context)
			if (result !== true) {
				return { error: new Error(`Output pipeline "${step}" failed: ${result}`) }
			}
		}
		return response
	}

	requireFS() {
		if (!this.fs) {
			throw new Error("You must connect a FS database to continue")
		}
	}

	/**
	 * Creates initial chat (system + configs).
	 * @returns {Promise<ChatMessage>}
	 */
	async createChat() {
		await this.requireFS()
		const content = await this.fs.loadDocumentAs(".txt", "system.md") || this.SYSTEM_MD
		return new ChatMessage({ role: ChatMessage.ROLES.system, content })
	}

	/**
	 * @param {ChatContext} context
	 * @returns
	 */
	async mightBeIncludes(context = new ChatContext()) {
		const inject = ({ content, uri, child, placeholder = "" }) => {
			if (undefined === content) {
				return child.mdTag + String(placeholder)
					+ ' <b style="color: red">(unable to read the document)</b>'
					+ child.mdEnd
			}
			return [
				"#### `" + uri + "`",
				"```" + this.fs.extname(uri).slice(1),
				content,
				"```", "",
			].join("\n")
		}
		/**
		 * @param {InterceptorInput} param0
		 * @returns {Promise<string>}
		 */
		const interceptor = async ({ element }) => {
			if (element instanceof MDList) {
				const result = []
				for (const child of element.children) {
					let [label = "", value = ""] = child.content.split("](")
					const ignore = [], keep = []
					if (!label.startsWith('[') || !value.endsWith(')')) {
						result.push(String(child))
						continue
					}
					label = label.slice(1)
					value = value.slice(0, -1)
					if (value.startsWith("./")) value = value.slice(2)
					if (value.endsWith("/")) value += "**"
					if (["-", "+"].includes(label[0])) {
						label.split(";").map(str => str.trim()).filter(Boolean).forEach(str => {
							if (str.startsWith("-")) ignore.push(str.slice(1))
							if (str.startsWith("+")) keep.push(str.slice(1))
						})
					}
					const listOnly = "ls" === label
					const pattern = new URIPattern(value)
					if (pattern.isRemote) {
						result.push(child.mdTag + child.content
							+ ' <b style="color: red">(injecting remote links not yet implemented)</b>'
							+ child.mdEnd)
						continue
					}
					if (listOnly || pattern.isPattern) {
						const stream = this.fs.findStream(pattern.staticPrefix)
						const entries = []
						for await (const entry of stream) entries.push(entry.file)
						const allFiles = Array.from(entries.map(e => e.path))
						if (listOnly) {
							result.push("#### Files:")
							allFiles.forEach(file => result.push(`- ${file}`))
							return result.join("\n")
						}
						let filtered = pattern.filter(allFiles)
						if (ignore.length) {
							filtered = micromatch.not(filtered, ignore)
						}
						for (const uri of filtered) {
							const stat = await this.fs.statDocument(uri)
							if (stat.isDirectory) continue
							const content = await this.fs.loadDocumentAs(".txt", uri)
							const placeholder = `[${label}](${uri})`
							const size = stat.size
							context.promptContext.set(uri, { label, content, child, placeholder, size })
							result.push(
								inject({ content, uri, child, placeholder })
							)
						}
					}
					else {
						try {
							const uri = value
							const ext = this.fs.extname(uri)
							const stat = await this.fs.statDocument(uri)
							let content = ".json" === ext ? await this.fs.loadDocument(uri, {})
								: await this.fs.loadDocumentAs(".txt", uri)
							if (".json" === ext && !listOnly) {
								content = JSON.stringify(content, null, 2)
							}
							const placeholder = child.content
							const size = stat.size
							context.promptContext.set(uri, { label, content, child, placeholder, size })
							result.push(
								inject({ content, uri, child, placeholder })
							)
						} catch (/** @type {any} */ err) {
							this.app.view.error(err.message)
							this.app.view.debug(err.stack)
						}
					}
				}
				return result.join("")
			}
			return element.content
		}
		if (context.input) {
			const md = new Markdown()
			md.parse(context.input)
			const content = await md.asyncStringify(interceptor)
			context.prompt = ChatMessage.from({ content })
			// md.document.toString()
			// const { message } = await this.parseMeMD(context.input)
			// context.prompt = message
		}
		return true
	}

	/**
	 * @param {any} input
	 * @returns {ChatAgent}
	 */
	static from(input) {
		if (input instanceof ChatAgent) return input
		return new ChatAgent(input)
	}
}