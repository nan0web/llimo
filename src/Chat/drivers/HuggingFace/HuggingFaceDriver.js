import { InferenceClient, PROVIDERS_OR_POLICIES } from "@huggingface/inference"
import { AutoTokenizer } from '@huggingface/transformers'
import ChatDriver from "../ChatDriver.js"
import HuggingFaceProvider from "./HuggingFaceProvider.js"
import HuggingFaceModels from "./Models/index.js"
import HuggingFaceProviders from "./Providers/index.js"
import HFDriverOptions from "./Options.js"
import { ChatModel, Response, ChatMessage } from "../../index.js"
import StreamOptions from "../../Stream/Options.js"

class HuggingFaceDriver extends ChatDriver {
	static DEFAULT_MODEL = "deepseek-ai/DeepSeek-V3"
	static DEFAULT_ENDPOINT = "https://api-inference.huggingface.co/models"
	static MODELS = HuggingFaceModels
	static PROVIDERS = HuggingFaceProviders
	static PROVIDERS_OR_POLICIES = PROVIDERS_OR_POLICIES

	/** @type {InferenceClient} */
	client
	/** @type {HFDriverOptions} */
	options

	/**
	 * @returns {HuggingFaceProvider}
	 */
	get provider() {
		return this.constructor.PROVIDERS[this.options.provider]
	}

	constructor(config = {}) {
		super(config)
		const {
			client = null,
			options = new HFDriverOptions(),
		} = config
		this.options = HFDriverOptions.from(options)
		this.client = client
	}

	async init() {
		await super.init()
		if (!this.auth?.apiKey) {
			throw new Error("Hugging Face API key is required")
		}
		this.client = new InferenceClient(this.auth.apiKey)
		const self = /** @type {typeof ChatDriver} */ (this.constructor)
		const model = this.model || self.DEFAULT_MODEL
		this.model = this.getModel(model)
	}

	/**
	 * @emits start {Object<...context, id, model, prompt, startedAt>}
	 * @param {string|ChatMessage} prompt Input prompt
	 * @param {string|ChatModel} model Model to use
	 * @param {object} [context={}] Context for events
	 * @returns
	 */
	async _complete(prompt, model, context = {}) {
		const self = /** @type {typeof ChatDriver} */ (this.constructor)
		let { id } = context
		if (!id) id = self.uniqueID()
		model = this.getModel(model) || model || this.model
		if (!this.client) {
			throw new Error("Driver is not initialized, client is undefined")
		}
		const startedAt = Date.now()
		const eventData = { ...context, id, model, prompt, startedAt }

		this.emit('start', eventData)

		try {
			const options = await this.prepareRequest(prompt)
			const tokens = await this.getTokensCount(options.messages[0].content)
			const tokens2 = await this.getTokensCount(prompt)
			// 15643
			this.emit("stream", { ...eventData, options })

			let content = ''
			const stream = this.client.chatCompletionStream(options)
			let currentUsage, currentId, currentModel
			const chunks = []

			for await (const chunk of stream) {
				if (chunk.choices?.[0]?.delta?.content) {
					content += chunk.choices[0].delta.content
					this.emit("data", {
						...eventData,
						chunk: chunk.choices[0].delta.content,
						content
					})
				}
				if (chunk.id) {
					currentId = chunk.id
				}
				if (chunk.usage) {
					currentUsage = chunk.usage
				}
				if (chunk.model) {
					currentModel = chunk.model
				}
				chunks.push(chunk)
			}

			const spentMs = Date.now() - startedAt
			const data = {
				content,
				role: 'assistant',
				spentMs,
				request_id: id,
				response_id: currentId,
				usage: currentUsage ?? {},
				model: currentModel ?? model?.name
			}
			const response = this.constructor.Response.from(data, model)

			this.emit('end', { ...eventData, data, response })
			return response

		} catch (error) {
			this.emit('error', { ...eventData, error })
			throw error
		}
	}

	/**
	 * @emits start {Object<...context, id, model, prompt, startedAt>}
	 * @emits stream {Object<...context, id, model, prompt, startedAt, options>}
	 * @emits data {Object<...context, id, model, prompt, startedAt, chunk, content>}
	 * @emits end  {Object<...context, id, model, prompt, startedAt, spentMs, content>}
	 * @param {*} prompt
	 * @param {*} model
	 * @param {*} context
	 */
	async *chatCompletionStream(prompt, model, context = {}) {
		const id = this.constructor.uniqueID()
		const startedAt = Date.now()
		const eventData = { ...context, id, model, prompt, startedAt }

		this.emit('start', eventData)

		try {
			// prompt = this._decodePrompt(prompt)
			const options = await this.prepareRequest(prompt)
			this.emit("stream", { ...eventData, options })
			const stream = this.client.chatCompletionStream(options)

			let content = ""

			for await (const chunk of stream) {
				if (chunk.choices?.[0]?.delta?.content) {
					this.emit("data", {
						...eventData,
						chunk: chunk.choices[0].delta.content,
						content: chunk.choices[0].delta.content
					})
					content += chunk.choices[0].delta.content
					yield chunk
				}
			}

			this.emit('end', { ...eventData, content, spentMs: Date.now() - startedAt })
		} catch (err) {
			this.emit('error', err)
			throw err
		}
	}

	getModels() {
		return this.provider.models.sort((a, b) => a.name.localeCompare(b.name))
	}

	getRealModel(model = this.model) {
		if (!model?.name) return false
		const [brand, name] = model.name.split("/")
		if (name.toLowerCase().startsWith("deepseek-v3")) {
			return "deepseek-ai/DeepSeek-V3"
		}
		if ("deepseek" === brand.toLowerCase()) {
			return ["deepseek-ai", name].join("/")
		}
		return model.name
	}

	async getTokens(content) {
		this.requireClient()
		this.requireModel()
		const tokenizer = await AutoTokenizer.from_pretrained(this.getRealModel())
		const inputs = await tokenizer.encode(content)
		return inputs
	}

	/**
	 * Returns extra added tokens to remove from the max_tokens.
	 * @returns {Promise<array>} - The extra added tokens.
	*/
	async getAddedTokens() {
		this.requireClient()
		this.requireModel()
		const tokenizer = await AutoTokenizer.from_pretrained(this.getRealModel())
		let added_tokens = tokenizer.added_tokens
		return added_tokens
	}

	requireClient() {
		if (!this.client) {
			throw new Error("Hugging Face API client is not initialized")
		}
	}

	/**
	 * Gets model by name and context.options.provider
	 * @param {string|Model} model - Model name
	 * @returns {Model|null} - Model instance
	 */
	getModel(model) {
		if (!model) return null
		const {
			provider = ""
		} = this.options ?? {}
		const PROVIDERS = this.constructor.PROVIDERS
		const specific = PROVIDERS[provider]
		if (!specific && provider) {
			throw new Error(`Provider ${provider} not found in ${Object.keys(PROVIDERS).join(", ")}`)
		}
		let result
		if (specific) result = specific.find(model.name ?? model)
		if (result) return result
		for (const name in PROVIDERS) {
			const provider = PROVIDERS[name]
			result = provider.find(model)
			if (result) return result
		}
		return super.getModel(model)
	}

	/**
	 * @param {StreamOptions} options
	 * @returns {Stream<ChatCompletionChunk> | ChatCompletion}
	 */
	async createChatCompletionStream(options) {
		return this.client.chatCompletionStream(options)
	}

	/**
	 * Stream function following OpenAIDriver algorithm
	 * @param {ChatMessage} chat
	 * @param {Model} model
	 * @param {Function} onData callback for each delta chunk
	 * @returns {Response}
	 */
	async stream(chat, model, onData = delta => 1) {
		this.requireClient()
		return await super.stream(chat, model, onData)
	}

	emitStreamStart(log) {
		this.emit("start", log)
	}

	emitStreamData(log) {
		this.emit("data", log)
	}

	emitStreamEnd(log) {
		this.emit("end", log)
	}
}

// @ts-ignore
export default HuggingFaceDriver
