import DB, { Data } from "@nan0web/db"
import { oneOf } from "@nan0web/types"
import ChatProvider from "./Chat/Provider.js"
import ChatModel from "./Chat/Model/Model.js"
import ChatMessage from "./Chat/Message.js"
import { View } from "@nan0web/ui"
import event from "@nan0web/event"
import ChatContext from "./Chat/Context.js"

class App {
	/** @type {string} */
	configFile
	/** @type {ChatProvider} */
	chatProvider
	/** @type {ChatModel} */
	chatModel
	/** @type {ChatMessage} */
	chat
	/** @type {DB} */
	db
	/** @type {View} */
	view
	constructor(props = {}) {
		const {
			configFile = "llm.config.js",
			chatProvider = {},
			chatModel = {},
			chat = "",
			db,
			view = new View(),
		} = props
		this.bus = event()
		this.configFile = String(configFile)
		this.chatProvider = ChatProvider.from(chatProvider)
		this.chatModel = ChatModel.from(chatModel)
		this.chat = ChatMessage.from(chat)
		this.db = db
		this.view = view
	}
	/**
	 * Resolves this.db as a document database.
	 */
	async requireDB() {
		throw new Error("Abstract! Must be implemented")
	}
	async requireProvider() {
		throw new Error("Abstract! Must be implemented")
	}
	async requireModel() {
		throw new Error("Abstract! Must be implemented")
	}
	async requireChatInput() {
		throw new Error("Abstract! Must be implemented")
	}
	/**
	 * Asks to save files [context.files].
	 * @param {ChatMessage} chat
	 * @param {ChatContext} context
	 */
	async requireSave(chat, context) {
		throw new Error("Abstract! Must be implemented")
	}
	/**
	 * Asks to run tests [context.tests].
	 * @param {ChatMessage} chat
	 * @param {ChatContext} context
	 */
	async requireTest(chat, context) {
		throw new Error("Abstract! Must be implemented")
	}
	async findConfigs({
		uri = this.configFile,
		configs = new Map(),
		allowedExt = [".js"]
	}) {
		await this.requireDB()
		const ext = this.db.extname(uri)
		if (!oneOf(...allowedExt)(ext)) {
			throw new Error("Invalid extension for the config file " + ext)
		}
		const file = await this.db.resolve(uri)
		const dir = this.db.dirname(file)
		do {
			const configFile = await this.db.resolve(dir, uri)
			try {
				await this.db.ensureAccess(configFile, "r")
				if (!configs.has(configFile)) {
					const data = await this.db.get(configFile)
					if (data) configs.set(configFile, data)
				}
			} catch {
				// do nothing
			}
		} while (dir.length > 0)
		try {
			await this.db.ensureAccess(file, "r")
			if (!file.endsWith("/" + uri) && file !== uri) {
				throw new Error("Incorrect config file")
			}
			if (!configs.has(file)) {
				configs.set(file, false)
			}
		} catch {
			// do nothing
		}
		return configs
	}
	async loadConfig(uri = this.configFile, configs = new Map()) {
		await this.findConfigs({ uri, configs })
		let combined = {}
		const fixed = []
		for (const [file] of configs) {
			const path = await this.db.resolve(file)
			fixed.push(path)
		}
		const unique = Array.from(new Set(fixed))
		for (const configFile of unique) {
			try {
				const config = await this.loadConfigFile(configFile)
				configs.set(configFile, config)
				combined = Data.merge(combined, config)
			} catch (err) {
				throw new Error("Cannot import file " + configFile)
			}
		}
		if (configs.size) {
			this.view.debug("Config loaded", ...Array.from(configs.keys()))
		} else {
			this.view.warn("No config files found")
		}
		return combined
	}
	async loadConfigFile(uri) {
		const imported = await import(uri)
		return imported.default
	}
}

export default App
