import OpenAI from "openai"
import ChatDriver from "../ChatDriver.js"
import OpenAIModels from "./models.js"
import StreamOptions from "../../Stream/Options.js"
import { Stream } from "openai/core/streaming.js"

/**
 * Driver for OpenAI API using official SDK
 */
class OpenAIDriver extends ChatDriver {
	static DEFAULT_ENDPOINT = "https://api.openai.com/v1"

	static DEFAULT_MODEL = "gpt-4o-mini"

	/** @type {OpenAI} */
	api

	constructor(input) {
		super(input)
		this.api = new OpenAI({ apiKey: this.auth?.apiKey })
	}

	/**
	 * @param {any} options
	 * @returns {AsyncGenerator<any, any, any>}
	 */
	async *createChatCompletionStream(options) {
		return this.api.chat.completions.create(options)
	}

	async getModels() {
		return Object.values(OpenAIModels)
	}

	async getModel(modelId) {
		return OpenAIModels[modelId]
	}

	async requireDb() {
		if (!this.db) {
			throw new Error("OpenAI API for getting usage is missing.\nSetup your local NANODb to store usage statistics.")
		}
		if (!this.db.connected) {
			await this.db.connect()
		}
		return this.db
	}

	async getUsage(start, end) {
		const db = await this.requireDb()
		const [startYear, startMonth, startDay] = start
		const [endYear, endMonth, endDay] = end
		const usage = db.find((uri) => {
			if (!uri.startsWith(`usage/`)) return false
			const [_, year, month, day] = uri.split('/')
			if (!(year >= startYear && year <= endYear)) return false
			if (!(month >= startMonth && month <= endMonth)) return false
			if (!(day >= startDay && day <= endDay)) return false
			return true
		})
		return usage
	}
}

export default OpenAIDriver
