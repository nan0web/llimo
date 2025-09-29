import { extname, resolve, relative } from "node:path"
import { existsSync, readFileSync } from "node:fs"
import { empty, oneOf } from "@nan0web/types"
import { findAllFiles, save } from "nanoweb-fs"
import { fileURLToPath } from "node:url"
const __dirname = resolve(fileURLToPath(import.meta.url), "..")

import systemMd from "./system.md/index.js"
import TestRunner from "./testing/TestRunner.js"
import CoderOutputContext from "./OutputContext.js"
import Agent from "../Agent/Agent.js"
import ChatMessage from "../../Chat/Message.js"

/**
 * @todo move to @nan0web/app
 */
import CommandMessage from "../../../../apps/core/src/io/messages/input/CommandMessage.js"
import TestRunnerExpect from "./testing/TestRunnerExpect.js"
import { Frame } from "@nan0web/ui"

/**
 * @typedef {object} ParsedFileBlock
 * @property {string} filePath
 * @property {string} content
 * @property {string|null} type
 */

/**
 * CoderAgent executes transformation pipeline for code-related LLM messages.
 * @requires this.app.requireSave(chat, context)
 * @requires this.app.requireTest(chat, context)
 * @requires this.app.ask({ label, options: ["Yes", "No"] })
 * @requires this.app.view.filesSaved({ files: Array<{file: string, content: string}> })
 */
class CoderAgent extends Agent {
	static OutputContext = CoderOutputContext
	static ID = "coder"
	static MESSAGES = {
		goodbye: [
			...Agent.MESSAGES.goodbye,
			"   Happy to help you code when you are ready 🤙", ""
		]
	}
	static SYSTEM_MD = systemMd
	name = "Coder.v1"
	desc = "code like a team of devs"
	inputPipeline = [
		"requireDB",
		"requireEmptyResponse"
	]
	outputPipeline = [
		"requireDB",
		"requireFilesAndCommands",
		// "requireMissingCode",
		"requireSave",
		"requireLocalTest",
		"requireProjectTest",
		"requireAnything",
	]
	constructor(props = {}) {
		super(props)
		const {
			name = this.name,
			desc = this.desc,
			inputPipeline = this.inputPipeline,
			outputPipeline = this.outputPipeline,
		} = props
		this.name = name
		this.desc = desc
		this.inputPipeline = inputPipeline
		this.outputPipeline = outputPipeline
	}

	_requireMessage(chat) {
		const message = chat.recent
		if (empty(message)) {
			throw new Error("No message to parse, provide chat input first")
		}
		return message
	}
	_requireAssistant(message) {
		if (message.role !== ChatMessage.ROLES.assistant) {
			throw new Error("Recent message must be from assistant")
		}
		return message
	}
	_requireCwd(context) {
		const { cwd } = context
		if (empty(cwd)) {
			throw new Error("Provide cwd for the context")
		}
		return context
	}

	/**
	 *
	 * @param {ChatMessage} chat
	 * @param {} context
	 * @param {Response} context.prevResponse
	 * @returns
	 */
	async requireEmptyResponse(chat, context = {}) {
		let {
			prevResponse,
			responseFile
		} = context
		if (empty(prevResponse)) {
			return true
		}
		const label = [
			"❓ It seems there is a response from a previous chat", "",
			"Do you want to continue with previous response?"
		]
		const ok = await this.app.ask({ label, options: ["Yes", "No"] })
		if (!oneOf("yes", "yep", "y")(String(ok).toLocaleLowerCase())) return true

		if (!chat.isRecent(prevResponse)) {
			prevResponse = null
			save(responseFile, "")
		}
		return true
	}

	/**
	 * Extract files from LLM response and store in context
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} [context={}]
	 * @returns {Promise<true>}
	 */
	async requireFilesAndCommands(chat, context = {}) {
		const message = this._requireMessage(chat)
		this._requireAssistant(message)
		const { files, commands } = this.parse(message.content)
		context.files = files
		context.commands = commands
		return true
	}

	/**
	 * Extract .:need blocks if any to detect missing required files
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} [context={}]
	 * @returns {Promise<true>}
	 */
	async requireMissingCode(chat, context = {}) {
		const message = this._requireMessage(chat)
		this._requireAssistant(message)
		const { cwd, files = [] } = this._requireCwd(context)
		if (!files.length) {
			return true
		}
		return true
	}

	/**
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} [context={}]
	 * @returns {Promise<true | string>}
	 */
	async requireSave(chat, context = {}) {
		const { cwd, files = [] } = this._requireCwd(context)
		if (!files.length) {
			return true
		}
		const ok = await this.app.requireSave(chat, context)
		if (ok) {
			for (const el of files) {
				const path = await this.db.resolve(cwd, el.file)
				await this.db.saveDocument(path, el.content)
			}
			this.app.view.filesSaved({ files })
		}
		return ok
	}

	/**
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} context
	 * @returns
	 */
	async requireTests(chat, context = {}, target = "local") {
		const { cwd, tests = [] } = this._requireCwd(context)
		const runner = new TestRunner(cwd)
		runner.emit("data", () => process.stdout.write("."))
		runner.emit("error", () => process.stderr.write("!"))
		const vitestPath = await this.db.resolve(__dirname, "vitest.js")
		const command = "node"
		const args = [vitestPath, ...tests]

		const output = []

		output.push("#### `.:bash`")
		output.push("```")
		output.push(["%", command, ...args].join(" "))
		this.app.view.clear(1)

		const first = ["Running tests", " ", target]

		runner.on("start", () => {
			this.app.view.progress(1)([
				first,
				["starting ..."],
				["..."],
				["."],
				["."],
				["."],
			])
		})
		const onData = ({ line, ...rest }) => {
			const ctx = TestRunnerExpect.from(rest)
			const table = Frame.table({ padding: 3 })([
				["Failed", ctx.failed, " " + "Total", ctx.tests, " " + "Skipped", ctx.skipped],
				["In (files)", ctx.totalFiles, " " + "Failed", ctx.failedFiles],
			])
			this.app.view.progress(1)([first, ...table, "", line, ""])
		}
		runner.on("data", onData)
		runner.on("error", onData)
		let total = { failed: 999 }
		try {
			total = await runner.run(args, command)
			const rows = runner.stdout.filter(row => row.trim() !== "")
			rows.forEach(r => output.push(r))
			if (!total.failed) return true
		} catch (err) {
			const errs = runner.stderr.filter(row =>
				!["", "Debugger attached.", "Waiting for the debugger to disconnect..."].includes(row)
			)
			errs.forEach(e => output.push(e))
		} finally {
			this.app.view.render(1)([
				[total.failed ? "❗️ " : "✅ ", "Tests complete"],
				[],
				[],
			])
		}
		output.push("```")
		const message = new ChatMessage({ content: output.join("\n") })
		chat.recent.add(message)
		return chat
	}

	/**
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} context
	 * @returns {Promise<Boolean>}
	 */
	async requireLocalTest(chat, context = {}) {
		const { files = [] } = context
		const tests = files.filter(el => /\.test\.(js|jsx)$/.test(el.file)).map(el => el.file)
		const messages = chat.flat()
		let recentPrompt
		for (let i = messages.length - 1; i > 0; i--) {
			const msg = messages[i]
			if (msg.role === ChatMessage.ROLES.user) {
				recentPrompt = msg
				break
			}
		}
		if (recentPrompt) {
			const { files } = this.parse(recentPrompt.content)
			const prevTests = files.filter(el => el.file.match(/\.test\.(js|jsx)$/)).map(el => el.file)
			prevTests.map(t => tests.push(t))
		}
		context.tests = Array.from(new Set(tests))
		if (empty(context.tests)) {
			return true
		}
		const ok = await this.app.requireTest(chat, context)
		if (ok) {
			const pass = await this.requireTests(chat, context, "local")
			return pass
		}
		return ok
	}

	/**
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} context
	 * @returns {Promise<Boolean>}
	 */
	async requireProjectTest(chat, context = {}) {
		const { files = [], tests = [] } = context
		if ([files, tests].every(empty)) {
			return true
		}
		const ctx = new CoderOutputContext({ ...context, tests: [] })
		const pass = await this.requireTests(chat, ctx, "project")
		return pass
	}

	/**
	 * @param {ChatMessage} chat
	 * @param {CoderOutputContext} context
	 */
	async requireAnything(chat, context = new CoderOutputContext()) {
		if ([context.files, context.tests, context.commands].every(empty)) {
			const question = new ChatMessage({
				role: ChatMessage.ROLES.user,
				content: [
					"No files, no tests and no commands were provided.",
					"Follow the rules of the chat."
				].join("\n")
			})
			const arr = chat.flat()
			const prev = arr.reduce((acc, item) => (
				item.role === ChatMessage.ROLES.user ? item : acc
			), null)
			if (prev?.isRecent(question)) {
				/** @note Unable to response already, exiting */
				throw new Error([
					"Unable to response, already responded the same.",
					"Check the logs."
				].join("\n"))
			}
			chat.recent.add(question)
			/** @note one more chance for proper answer send the question */
			return chat
		}
		return true
	}

	decode(content) {
		return this.parse(content)
	}

	/**
	 * Parses the given content into file and command blocks.
	 *
	 * @param {string} content - The raw input content containing file or command blocks.
	 * @returns {{
	 *   files: Array<{
	 *     file: string,
	 *     content: string,
	 *     type: string
	 *   }>,
	 *   commands: Array<{
	 *     command: string,
	 *     content: string,
	 *     type: string,
	 *     [key: string]: string
	 *   }>
	 * }} An object containing arrays of parsed file entries and command entries.
	 */
	parse(content) {
		const original = this.parseFileBlocks(content)
		const files = []
		const commands = []
		for (let { filePath, content, type } of original) {
			if (filePath.startsWith(".:")) {
				const [command, ..._] = filePath.slice(".:".length).split(' ')
				const cmd = CommandMessage.parse(_.join(' '))
				commands.push({ ...cmd, command, content, type })
			} else {
				files.push({ file: filePath, content, type })
			}
		}
		return { files, commands }
	}

	parseBlocks(content) {
		const original = this.parseFileBlocks(content)
		const files = []
		const commands = []
		const messages = []
		const requests = []
		for (let { filePath, content } of original) {
			if (".:bash" === filePath) {
				commands.push(content)
				continue
			} else if (".:need" === filePath) {
				content.trim().split("\n").forEach(row => requests.push(row))
			} else if (".:task" === filePath) {
				const [status, ...text] = content.split("\n")
				messages.push({ status, text: text.join("\n") })
			} else {
				files.push({ file: filePath, content })
			}
		}
		return { files, commands, messages, requests }
	}

	normalizeEscapedContent(content) {
		return content.trim().split("\n").map(
			row => row.replace(/^---```---$/, "```").replace(/^---#### `(.+)`---$/g, "#### `$1`")
		).join("\n")
	}

	normalizeInputAttrs(attrs = {}) {
		const sanitizers = []
		const { type = "text", ...rest } = attrs

		if (type === "number") {
			sanitizers.push([(x) => Number(x), ["min", "max", "step"]])
		}
		if (type === "text") {
			sanitizers.push([(x) => Number(x), ["minlength", "maxlength"]])
		}

		for (const [fn, fields = []] of sanitizers) {
			fields.forEach(field => {
				if (attrs[field] === undefined) return
				attrs[field] = fn(attrs[field])
			})
		}

		return attrs
	}

	parseFileBlocks(content) {
		const rows = String(content).split("\n")
		const files = []
		let currentFile = null
		let type = null
		let currentContent = []

		for (const row of rows) {
			const fileHeaderMatch = row.match(/^####\s*`(.+)`$/)
			if (fileHeaderMatch) {
				if (currentFile) {
					files.push({
						filePath: currentFile,
						content: this.normalizeEscapedContent(currentContent.join("\n")),
						type
					})
				}
				currentFile = fileHeaderMatch[1]
				currentContent = []
				type = null
				continue
			}

			const codeBlockStartMatch = row.match(/^```(\w+)?$/)
			if (codeBlockStartMatch?.[1] && null === type) {
				type = codeBlockStartMatch[1]
			}
			if (row.trim() === "```" && currentFile) {
				files.push({
					filePath: currentFile,
					content: this.normalizeEscapedContent(currentContent.join("\n")),
					type
				})
				currentFile = null
				type = null
				currentContent = []
				continue
			}

			if (codeBlockStartMatch && currentFile) continue
			if (currentFile) currentContent.push(row)
		}

		if (currentFile && currentContent.length) {
			files.push({
				filePath: currentFile,
				content: this.normalizeEscapedContent(currentContent.join("\n")),
				type
			})
		}

		return files
	}

	parseDiff(diff) {
		const removedBlocksByFile = {}
		const lines = String(diff).split('\n')
		let currentFile = null
		let inHunk = false
		let removedBlock = []

		for (const line of lines) {
			if (line.startsWith('diff --git')) {
				const match = line.match(/^diff --git a\/(.+?) b\//)
				if (match) {
					currentFile = match[1]
					removedBlocksByFile[currentFile] = []
				}
				inHunk = false
				continue
			}
			if (!currentFile) continue

			if (line.startsWith('@@')) {
				inHunk = true
				const [a, b] = line.split("@@ ")[1].trim().split(" ")
				continue
			}
			if (!inHunk) continue

			if (line.startsWith('-')) {
				removedBlock.push(line.slice(1))
			} else {
				if (removedBlock.length) {
					removedBlocksByFile[currentFile].push(removedBlock.join('\n'))
					removedBlock = []
				}
			}
		}
		if (removedBlock.length && currentFile) {
			removedBlocksByFile[currentFile].push(removedBlock.join('\n'))
		}
		return removedBlocksByFile
	}

	async parseMeMD(content, cwd = ".") {
		const readInclude = (path, context = { files: [], tests: [] }) => {
			const files = [], tests = []
			if (path.endsWith("*") || path.endsWith("/")) {
				const asDir = path.endsWith("/")
				const dir = resolve(cwd, path.slice(0, -1), asDir ? "." : "..")
				const all = findAllFiles(dir)
				let affix = path.startsWith("./") ? path.slice(2, -1) : path.slice(0, -1)
				if (asDir) affix += "/"
				all.map(file => relative(cwd, file))
					.filter(file => file.startsWith(affix))
					.forEach(file => {
						if (file.match(/\.test\.(js|jsx)$/)) {
							tests.push(file)
						} else {
							files.push(file)
						}
					})
			} else if (path.match(/\.test\.(js|jsx)$/)) {
				tests.push(relative(cwd, path))
			} else {
				files.push(relative(cwd, path))
			}
			context.files = files
			context.tests = tests
			return [...files, ...tests].map(file => {
				const filePath = resolve(cwd, file)
				if (!existsSync(filePath)) {
					throw new Error("File not found: " + file)
				}
				const ext = String(extname(file) ?? ".").slice(1)
				const rel = /^[\.\/]/.test(file) ? file : `./${file}`
				return `#### \`${rel}\`\n\`\`\`${ext}\n${readFileSync(filePath, "utf-8")}\n\`\`\``
			}).join("\n\n")
		}

		const rows = content.split("\n")
		const includes = []
		let tests = []

		const processed = rows.map((row, i) => {
			const str = row.trim()
			const matches = str.match(/^- \[([^\]]*)\]\(([^\)]+)\)$/i)
			if (matches) {
				const [, text, path] = matches
				const context = {}
				const content = readInclude(path, context)
				tests = [...tests, ...context.tests]
				includes.push({ i, text, path, content })
				const arr = []
				if (text) arr.push(`### ${text}`)
				arr.push(content)
				return arr.join("\n")
			}
			return row
		}).join("\n").trim()

		const message = ChatMessage.from({ content: processed })
		return { message, content, processed, includes, tests }
	}
}

export default CoderAgent
