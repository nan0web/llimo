import { extname, resolve, relative } from "node:path"
import { existsSync, readFileSync } from "node:fs"
import { findAllFiles } from "nanoweb-fs"
import { empty } from "@nan0web/types"
import DB from "@nan0web/db"
import NanoEvent from "@yaro.page/nano-events"

import systemMd from "./system.md/index.js"
import InputContext from "./InputContext.js"
import OutputContext from "./OutputContext.js"
import App from "../../App.js"
import ChatMessage from "../../Chat/Message.js"
import Response from "../../Chat/Response.js"

/**
 * Agent provides shared logic for communication between LLM and user context.
 * @requires this.app.chatProvider.driver
 * @requires this.app.chatModel
 * @requires this.app.findConfigs({ uri: "system.md", allowedExt: [".md"], configs })
 * @requires this.app.chatProvider.driver.getTokensCount(message)
 */
class Agent extends NanoEvent {
	static ID = "chat"
	static MESSAGES = {
		goodbye: [
			"", "🙏 Take care!", ""
		]
	}
	static SYSTEM_MD = systemMd
	/** @type {string[]} */
	inputPipeline = []
	/** @type {string[]} */
	outputPipeline = []
	/**
	 * @type {string}
	 */
	name = "Plain chat.v1"
	/**
	 * @type {string}
	 */
	desc = "no transformers, no magic, just a chat with LLM"
	/** @type {App} */
	app
	/** @type {DB} */
	db
	constructor(props = {}) {
		super()
		const {
			inputPipeline = this.inputPipeline,
			outputPipeline = this.outputPipeline,
			name = this.name,
			desc = this.desc,
			app = new App(),
			db = new DB(),
		} = props
		this.inputPipeline = inputPipeline
		this.outputPipeline = outputPipeline
		this.name = name
		this.desc = desc
		this.app = app
		this.db = db
	}
	/**
	 * @param {ChatMessage} chat
	 * @param {OutputContext} [context={}]
	 * @returns {true | any} True on successm and error message on failure.
	 */
	async transformOutput(chat, context = {}) {
		for (const step of this.outputPipeline ?? []) {
			const ok = await this[step](chat, context)
			if (true !== ok) {
				return ok
			}
		}
		return true
	}
	/**
	 * @param {ChatMessage} chat
	 * @param {InputContext} context
	 * @returns {true | any} True on successm and error message on failure.
	 */
	async transformInput(chat, context = {}) {
		for (const step of this.inputPipeline ?? []) {
			const ok = await this[step](chat, context)
			if (true !== ok) {
				return ok
			}
		}
		return true
	}
	/**
	 * @emits process.start
	 * @emits process.data
	 * @emits process.end
	 * @param {ChatMessage} chat
	 * @param {object} context
	 * @returns {Response}
	 */
	async process(chat, context = {}) {
		if (empty(chat)) {
			chat = this.createChat()
		}
		const ok = await this.transformInput(chat, context)
		if (true !== ok) {
			throw new Error([
				"Cannot transform input",
				Array.isArray(ok) ? ok.join("\n") : String(ok)
			].join("\n"))
		}
		const driver = this.app.chatProvider.driver
		await driver.init()
		const onStart = (event) => this.emit("process.start", { event, context })
		const onData = (event) => this.emit("process.data", { event, context })
		const onEnd = (event) => this.emit("process.end", { event, context })
		driver.on("start", onStart)
		driver.on("data", onData)
		driver.on("end", onEnd)

		const response = await driver.stream(chat, this.app.chatModel)
		driver.off("start", onStart)
		driver.off("data", onData)
		driver.off("end", onEnd)
		return response
	}

	/**
	 * Creates a first (root) message with the system instructions.
	 * @returns {ChatMessage}
	 */
	async createChat() {
		await this.requireDB()
		const configs = []
		await this.app.findConfigs({ uri: "system.md", allowedExt: [".md"], configs })
		const systems = [
			new ChatMessage(this.constructor.SYSTEM_MD)
		]
		for (const configFile of configs) {
			try {
				const content = await this.db.loadDocument(configFile)
				if (empty(content)) {
					continue
				}
				systems.push(ChatMessage.from({ content }))
			} catch {
				// continue to next
			}
		}
		let content = ""
		for (const system of systems) {
			content += "\n\n" + system.content
		}
		// collect all the
		const count = await this.getTokensCount(content)
		return ChatMessage.from({
			content,
			count,
			role: ChatMessage.ROLES.system
		})
	}

	/**
	 * @param {{
	 *   chat: string,          // content of chat.md
	 *   prompt: string,        // content of prompt.md
	 *   response: string,      // content of response.md
	 *   stream: string,        // content of stream.md
	 *   log: object            // parsed content of log.json
	 * }} content - Loaded content of the files.
	 * @returns {ChatMessage}
	 */
	loadChat(content) {
		return ChatMessage.fromLog(content.chat)
	}

	toString() {
		return [this.name, this.desc].join(": ")
	}

	/**
	 * @param {ChatMessage|string} message
	 */
	getTokensCount(message) {
		return this.app.chatProvider.driver.getTokensCount(message)
	}

	requireDB() {
		/** @note throws an error if not extended */
		this.db.relative("/", "/to")
		return true
	}

	async parseMeMD(content, cwd = ".") {
		const readInclude = async (path, context = {}) => {
			const {
				files = [],
				inline = false,
			} = context
			if (path.endsWith("*") || path.endsWith("/")) {
				const asDir = path.endsWith("/")
				const dir = resolve(cwd, path.slice(0, -1), asDir ? "." : "..")
				this.db.find
				const all = findAllFiles(dir)
				let affix = path.startsWith("./") ? path.slice(2, -1) : path.slice(0, -1)
				if (asDir) affix += "/"
				all.map(file => relative(cwd, file))
					.filter(file => file.startsWith(affix))
					.forEach(file => files.push(file))
			} else {
				files.push(relative(cwd, path))
			}
			return files.map(file => {
				const filePath = resolve(cwd, file)
				if (!existsSync(filePath)) {
					throw new Error("File not found: " + file)
				}
				const ext = String(extname(file) ?? ".").slice(1)
				const rel = /^[\.\/]/.test(file) ? file : `./${file}`
				const content = readFileSync(filePath, "utf-8")
				if (inline) {
					return content
				}
				return `#### \`${rel}\`\n\`\`\`${ext}\n${content}\n\`\`\``
			}).join("\n\n")
		}

		const rows = content.split("\n")
		const includes = []

		const processed = rows.map((row, i) => {
			const str = row.trim()
			const matches = str.match(/^- \[([^\]]*)\]\(([^\)]+)\)$/i)
			if (matches) {
				const [, text, path] = matches
				const context = {
					inline: text.endsWith("<")
				}
				const content = readInclude(path, context)
				includes.push({ i, text, path, content })
				const arr = []
				if (text) arr.push(`### ${text}`)
				arr.push(content)
				return arr.join("\n")
			}
			return row
		}).join("\n").trim()

		const message = ChatMessage.from({ content: processed })
		return { message, content, processed, includes }
	}
}

export default Agent
