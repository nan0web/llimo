import OpenAI from "openai"
import { Stream } from "openai/core/streaming.js"
import ChatDriver from "../ChatDriver.js"
import { to } from "@nan0web/types"
import OpenRouterOptions from "./Options.js"
import StreamOptions from "../../Stream/Options.js"
import ChatMessage, { ChatModel, Response } from "../../index.js"

class ExtendedOpenAI extends OpenAI {
	constructor(options) {
		super(options)
	}

	async fetchWithTimeout(url, req, timeout, controller) {
		return await super.fetchWithTimeout(url, req, timeout, controller)
	}

	async prepareRequest(
		request,
		{ url, options } = {},
	) {
		return await super.prepareRequest(request, { url, options })
	}
}

/**
 * Driver for OpenRouter API using official SDK with compatible interface
 * @example
 * ```js
 * const driver = new OpenRouterDriver({
 *   auth: { apiKey: process.env.OPENROUTER_API_KEY },
 *   model: "qwen/qwen2.5-7b-instruct"
 * })
 * ```
 */
class OpenRouterDriver extends ChatDriver {
	static DEFAULT_ENDPOINT = "https://openrouter.ai/api/v1"
	static DEFAULT_MODEL = "qwen/qwen2.5-7b-instruct"
	static DEFAULT_HEADERS = {
		// "HTTP-Referer": "https://nan0web.app",
		// "X-Title": "nan0web"
	}

	/** @type {OpenAI} */
	api
	/** @type {OpenRouterOptions} */
	options

	constructor(config = {}) {
		super(config)
		const {
			api = null,
			options = new OpenRouterOptions(),
		} = config

		this.api = api
		this.options = OpenRouterOptions.from(options)
	}

	/**
	 * @emits start {Object<...context, id, model, prompt, startedAt>}
	 * @param {string|ChatMessage} prompt - Input prompt
	 * @param {string|ChatModel} model - Model to use
	 * @param {object} [context={}] - Context for events
	 * @returns {Promise<Response>}
	 */
	async _complete(prompt, model, context = {}) {
		const self = /** @type {typeof ChatDriver} */ (this.constructor)
		let { id } = context
		if (!id) id = self.uniqueID()

		model = this.getModel(model) || model || this.model
		if (!model) {
			throw new Error("No model specified for completion")
		}

		if (!this.auth?.apiKey) {
			throw new Error("OpenRouter API key is required")
		}

		if (!this.api) {
			await this.init()
		}

		const startedAt = Date.now()
		const eventData = { ...context, id, model, prompt, startedAt }

		this.emit('start', eventData)

		try {
			const options = await this.prepareRequest(prompt, model)
			this.emit("stream", { ...eventData, options })

			const response = await this.api.chat.completions.create(options)

			// Format OpenRouter API response to Response standard
			const data = {
				content: response.choices[0].message.content,
				role: response.choices[0].message.role,
				spentMs: Date.now() - startedAt,
				request_id: id,
				response_id: response.id,
				usage: response.usage,
				model: response.model,
				prompt_timings: response.prompt_timings
			}

			const responseObj = this.constructor.Response.from(data, model)

			this.emit('end', { ...eventData, data, response: responseObj })
			return responseObj

		} catch (error) {
			this.emit('error', { ...eventData, error })
			throw error
		}
	}

	/**
	 * Prepare request for OpenRouter API
	 * @param {string|ChatMessage} prompt
	 * @param {ChatModel|string} model
	 * @param {boolean} [stream=false] - Whether this is a streaming request
	 * @returns {object}
	 */
	async prepareRequest(prompt, model, stream = false) {
		if (!model) model = this.model
		if (typeof model === "string") {
			model = this.getModel(model)
		}

		return {
			model: model.name,
			messages: [
				{
					role: "user",
					content: prompt.toString()
				}
			],
			stream,
			...to(Object)(this.options)
		}
	}

	async init() {
		await super.init()
		if (!this.auth?.apiKey) {
			throw new Error("OpenRouter API key is required")
		}

		const endpoint = this.options.endpoint || this.DEFAULT_ENDPOINT

		this.api = new ExtendedOpenAI({
			apiKey: this.auth.apiKey,
			baseURL: endpoint,
			defaultHeaders: {
				...this.DEFAULT_HEADERS,
				"HTTP-Referer": this.options.referer || this.DEFAULT_HEADERS["HTTP-Referer"],
				"X-Title": this.options.title || this.DEFAULT_HEADERS["X-Title"]
			}
		})
	}

	async getModels() {
		const list = await this.api.models.list()
		const models = list.data.map(a => Model.from(a))
		return models.sort((a, b) => a.name.localeCompare(b.name))
	}

	/**
	 * Gets model by name
	 * @param {string|ChatModel} model - Model name or Model instance
	 * @returns {Promise<ChatModel|null>} - Model instance or null
	 */
	async getModel(model) {
		if (!model) return null
		if (model instanceof ChatModel) return model
		return OpenRouterDriver.MODELS[model] || null
	}

	/**
	 * @param {StreamOptions} options
	 * @returns {Promise<Stream<ChatCompletionChunk> | ChatCompletion>}
	 */
	async createChatCompletionStream(options) {
		if (!this.api) {
			await this.init()
		}
		return this.api.chat.completions.create(options)
	}
}

OpenRouterDriver.Options = OpenRouterOptions
OpenRouterDriver.Response = Response

export default OpenRouterDriver
