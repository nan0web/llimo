import OpenAI from "openai"
import { to } from "@nan0web/types"
import ChatDriver from "../ChatDriver.js"
import OpenAIModels from "./models.js"
import ChatMessage from "../../Message.js"
import Prompt from "../../Prompt.js"
import Model from "../../Model.js"
import Response from "../../Response.js"
import ChatChunk from "../../Stream/Chunk.js"
import Usage from "../../Usage.js"
import StreamOptions from "../../Stream/Options.js"
import StreamEmitStartContext from "../../Stream/EmitStartContext.js"
import StreamEmitDataContext from "../../Stream/EmitDataContext.js"
import StreamEmitEndContext from "../../Stream/EmitEndContext.js"
import StreamLog from "../../Stream/Log.js"

/**
 * Driver for OpenAI API using official SDK
 */
class OpenAIDriver extends ChatDriver {
	static DEFAULT_ENDPOINT = "https://api.openai.com/v1"

	static DEFAULT_MODEL = "gpt-4.1-nano"

	async init() {
		await super.init()
		this.api = new OpenAI({ apiKey: this.auth?.apiKey })
	}

	async chat(prompt, model) {
		const messages = this._decodePrompt(prompt).toArray()
		const res = await this.api.chat.completions.create({
			model: model.name,
			messages,
		})
		return this.__.Response.from({
			content: res.choices[0].message.content,
			role: "assistant",
			response_id: res.id,
			model: res.model,
		}, model)
	}

	/**
	 * @param {StreamOptions} options
	 * @returns {Stream<ChatCompletionChunk> | ChatCompletion}
	 */
	async createChatCompletionStream(options) {
		return this.api.chat.completions.create(options)
	}

	async storeStarted() {
		if (!this.db) {
			return false
		}
		this.db.set()
	}

	/**
	 *
	 * @param {Prompt} prompt
	 * @param {Model} model
	 * @param {object} context
	 * @returns {Promise<Response>}
	 */
	async _complete(prompt, model, context = {}) {
		const id = this.constructor.uniqueID()
		const startedAt = Date.now()
		const eventData = { ...context, id, model, prompt, startedAt }

		this.requireEvents()
		this.emit('start', eventData)

		let i = 0
		const interval = setInterval(() => {
			this.emit('completeInterval', { ...eventData, i: i++ })
		}, 99)

		try {
			const messages = this._decodePrompt(prompt).toArray()
			const options = new StreamOptions({
				model: model.name || this.constructor.DEFAULT_MODEL,
				messages,
				stream: true
			})
			/** @type {Stream<ChatCompletionChunk> | ChatCompletion} */
			const stream = await this.api.chat.completions.create(options)
			let content = ""
			for await (const ch of stream) {
				const chunk = new ChatChunk(ch)
				const delta = chunk.choices[0]?.delta.content
				if (delta) {
					content += delta
					this.emit("data", { ...eventData, chunk, delta, options })
				}
			}
			this.emit("end", { ...eventData, options, content })
			clearInterval(interval)
			const spentMs = Date.now() - startedAt
			return this.__.Response.from({
				content,
				role: ChatMessage.ROLES.assistant,
				spentMs,
				request_id: id,
				// response_id: ?,
				// usage: ?,
				// model: ?,
			})
		} catch (err) {
			clearInterval(interval)
			this.emit('error', err)
			return Promise.reject(err)
		}
	}

	getModels() {
		return Object.values(OpenAIModels)
	}

	getModel(modelId) {
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
			this.isInDateRange()
			const [_, year, month, day] = uri.split('/')
			if (!(year >= startYear && year <= endYear)) return false
			if (!(month >= startMonth && month <= endMonth)) return false
			if (!(day >= startDay && day <= endDay)) return false
			return true
		})
		return usage
	}

	async getPricingTable() {
		const usage = await this.getBillingUsage()
		const sub = await this.getBillingSubscription()
		return { usage, subscription: sub }
	}
}

export default OpenAIDriver
