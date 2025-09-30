import crypto from "node:crypto"
import fetch, { ResponseMessage } from "@nan0web/http-node"
import DB, { Data } from "@nan0web/db"
import { to } from "@nan0web/types"
import event from "@nan0web/event"
import { encode } from 'gpt-tokenizer'
import ChatModel from "../Model/Model.js"
import Response from "../Response.js"
import Options from "../Options.js"
import { readValueOrFile } from "nanoweb-fs"
import ChatMessage from "../Message.js"
import DriverOptions from "./Options.js"

import Usage from "../Usage.js"
import ChatChunk from "../Stream/Chunk.js"
import StreamOptions from "../Stream/Options.js"
import StreamEmitStartContext from "../Stream/EmitStartContext.js"
import StreamEmitDataContext from "../Stream/EmitDataContext.js"
import StreamEmitEndContext from "../Stream/EmitEndContext.js"
import StreamLog from "../Stream/Log.js"

/**
 * Base class for chat drivers
 */
export default class ChatDriver {
	static MODELS = {}
	static PROVIDERS = {}
	static DRIVERS = {}
	static DEFAULT_MODEL = ""
	static DEFAULT_ENDPOINT = ""
	/** @type {Record<string, string>} */
	static DEFAULT_HEADERS = {}
	static DEFAULT_MAX_TOKENS = 65_536
	static LOG_STREAM_INTERVAL = 3000
	static IGNORE_AUTH = false
	static Prompt = ChatMessage
	static Response = Response
	static DB = DB
	/**
	 * @type {object}
	 * @deprecated
	 */
	config
	/** @type {object} */
	auth
	/** @type {ChatModel} */
	model
	/** @type {DB} */
	db
	/** @type {DriverOptions} */
	options

	/**
	 * Creates driver instance
	 * @param {object} props
	 * @param {object} [props.auth={}] Auth config.
	 * @param {ChatModel} props.model Model
	 * @param {DB} props.db Database
	 * @param {Partial<DriverOptions>} props.options Default options
	 */
	constructor(props) {
		const {
			auth = {},
			model,
			db,
			options = {},
		} = props
		this.auth = auth
		this.model = model
		this.db = db
		this.options = DriverOptions.from(options)
		this.bus = event()
	}

	on(event, fn) {
		this.bus.on(event, fn)
	}
	off(event, fn) {
		this.bus.off(event, fn)
	}
	async emit(event, data) {
		return this.bus.emit(event, data)
	}

	/**
	 * @returns {typeof Response}
	 */
	get Response() {
		return /** @type {typeof ChatDriver} */ (this.constructor).Response
	}

	/**
	 * @returns {string}
	 */
	get DEFAULT_ENDPOINT() {
		return /** @type {typeof ChatDriver} */ (this.constructor).DEFAULT_ENDPOINT
	}

	/**
	 * @returns {string}
	 */
	get DEFAULT_MODEL() {
		return /** @type {typeof ChatDriver} */ (this.constructor).DEFAULT_MODEL
	}

	/**
	 * @returns {number}
	 */
	get DEFAULT_MAX_TOKENS() {
		return /** @type {typeof ChatDriver} */ (this.constructor).DEFAULT_MAX_TOKENS
	}

	/**
	 * @returns {Record<string, string>}
	 */
	get DEFAULT_HEADERS() {
		return /** @type {typeof ChatDriver} */ (this.constructor).DEFAULT_HEADERS
	}

	/**
	 * @returns {Record<string, object>}
	 */
	get MODELS() {
		return /** @type {typeof ChatDriver} */ (this.constructor).MODELS
	}

	/**
	 * @returns {number}
	 */
	get LOG_STREAM_INTERVAL() {
		return /** @type {typeof ChatDriver} */ (this.constructor).LOG_STREAM_INTERVAL
	}


	toPublic() {
		const { auth, ...rest } = this.config || {}
		return { ...rest }
	}

	toString() {
		if (this.options.provider) {
			return this.constructor.name + "." + this.options.provider
		}
		return this.constructor.name
	}

	requireModel() {
		if (!this.model) {
			throw new Error("Model is not set")
		}
	}

	/**
		 * @todo write tests to be sure the events are triggered only once, without duplicates.
		 */
	requireEvents(prefix = "", off = false) {
		let lastSave = 0
		const suffix = "." + (prefix ? prefix.replaceAll(".", "") : "stream")
		const saveLog = async (log, useTimer = false) => {
			if (!this.db) return false
			const allowed = !useTimer || (Date.now() - lastSave > this.LOG_STREAM_INTERVAL)
			if (allowed) {
				await this.db.set(log.uri + suffix + ".json", to(Object)(log))
				await this.db.push()
				lastSave = Date.now()
			}
			return true
		}
		const onStart = async (log) => {
			this.emit("started", log)
			if (prefix) {
				this.emit(prefix + ".started", log)
			}
			await saveLog(log)
		}
		const onData = async (log) => {
			this.emit("received", log)
			if (prefix) {
				this.emit(prefix + ".received", log)
			}
			await saveLog(log, true)
		}
		const onEnd = async (log) => {
			this.emit("ended", log)
			if (prefix) {
				this.emit(prefix + ".ended", log)
			}
			await saveLog(log)
		}
		if (off) {
			this.off("start", onStart)
			this.off("data", onData)
			this.off('end', onEnd)
			return
		}
		this.on("start", onStart)
		this.on("data", onData)
		this.on('end', onEnd)
	}

	/**
	 * Initializes the driver
	 * @returns {Promise<void>}
	 */
	async init() {
		if (!this.model) {
			const model = await this.getModel(this.DEFAULT_MODEL)
			if (!model) {
				throw new Error("Model is not defined")
			}
			this.model = model
		}
		if (this.auth) {
			const entries = []
			for (const [key, value] of Object.entries(this.auth)) {
				const v = await this.readValueOrFile(value, this.db.absolute("."))
				entries.push([key, v])
			}
			this.auth = Object.fromEntries(entries)
		}
		return
	}

	async readValueOrFile(value, file) {
		return readValueOrFile(value, file)
	}

	/**
	 * Wrapper for fetch requests
	 * @param {string} url Request URL
	 * @param {object} req Request options
	 * @returns {Promise<ResponseMessage>} Fetch response
	 */
	async fetch(url, req) {
		return await fetch(url, req)
	}

	/**
	 * Generates unique ID for requests
	 * @returns {string} Unique ID
	 */
	static uniqueID() {
		const date = new Date().toISOString().replace(/[-:.]/g, "")
		const randomBytes = crypto.randomBytes(3).toString('hex')
		return `${date.slice(0, -1)}-${randomBytes}`
	}

	/**
	 * Gets model by name
	 * @param {string|ChatModel} model - Model name
	 * @returns {Promise<ChatModel|null>} - Model instance
	 */
	async getModel(model) {
		if (!model) return null
		if (this.model && this.model.name === model) return this.model
		if (model instanceof ChatModel) {
			return Object.entries(this.MODELS).map(([, m]) => m).find(m => m === model)
		}
		if (this.MODELS[model]) {
			return this.MODELS[model]
		}
		for (const entry of Object.values(this.MODELS)) {
			if (entry.name === model || entry.name.startsWith(model)) {
				return entry
			}
		}
		return null
	}

	/**
	 * @returns {Promise<ChatModel[]>}
	 */
	async getModels() {
		return []
	}

	getRealModel() {
		return this.model.name ?? this.DEFAULT_MODEL
	}

	/**
	 * @param {StreamLog} log
	 */
	emitStreamStart(log) {
		this.emit("start", log)
	}
	/**
	 * @param {StreamLog} log
	 */
	emitStreamData(log) {
		this.emit("data", log)
	}
	/**
	 * @param {StreamLog} log
	 */
	emitStreamEnd(log) {
		this.emit("end", log)
	}

	/**
	 * @param {ChatChunk} chunk
	 * @param {ChatChunk[]} chunks
	 * @param {boolean} thinking
	 * @returns {boolean}
	 */
	isThinking(chunk, chunks = [], thinking = false) {
		if (!chunks.length && "<think>" === chunk.choices?.[0].delta.content) {
			thinking = true
		}
		else if (thinking && "</think>" === chunk.choices?.[0].delta.content) {
			thinking = false
		}
		return thinking
	}

	/**
	 * @param {ChatChunk} chunk
	 * @returns {boolean} True on success, false on failre.
	 */
	isThinkingToken(chunk) {
		return ["<think>", "</think>"].includes(chunk.choices?.[0].delta.content)
	}

	/**
	 * Completes prompt using LLM model
	 * @param {string|ChatMessage} prompt Input prompt
	 * @param {string|ChatModel} model Model to use
	 * @param {object} [context={}] Context for events
	 * @returns {Promise<Response | undefined>} Response
	 */
	async complete(prompt, model, context = {}) {
		if ('string' === typeof model) {
			const m = await this.getModel(model)
			if (!(m instanceof ChatModel)) {
				throw new Error("Model not found: " + model)
			}
			model = m
		}
		return this._complete(prompt, model, context)
	}

	/**
	 * @param {Array<{ role: string, content: string }>} messages
	 * @returns {StreamOptions}
	 */
	getStreamOptions(messages) {
		return new StreamOptions({
			...to(Object)(this.options),
			model: this.getRealModel(),
			messages,
			stream: true
		})
	}

	/**
	 * @param {ChatMessage} chat
	 * @param {ChatModel} model
	 * @param {Function} onData
	 * @returns {Promise<Response>}
	 */
	async stream(chat, model, onData = delta => 1) {
		this.model = model
		this.requireModel()
		this.requireEvents("stream.")
		try {
			const messages = chat.flat().map(msg => ({ role: msg.role, content: msg.content }))
			const options = this.getStreamOptions(messages)
			let usage = new Usage({
				prompt_tokens: chat.count,
				cached_tokens: chat.count,
				total_tokens: chat.count,
			})
			model.calc(usage)
			const start = new StreamEmitStartContext({ options, chat, usage })
			const log = new StreamLog({ start })
			this.emitStreamStart(log)
			const stream = await this.createChatCompletionStream(options)
			let content = "", thinking = false, startedAt = Date.now()
			const chunks = [], thoughts = [], answer = []
			for await (const ch of stream) {
				const chunk = new ChatChunk(ch)
				const delta = chunk.choices[0]?.delta.content
				thinking = this.isThinking(chunk, chunks, thinking)
				if (thinking) {
					thoughts.push(chunk)
				}
				else if (!this.isThinkingToken(chunk)) {
					answer.push(chunk)
				}
				chunks.push(chunk)
				if (delta) {
					content += delta
					onData?.(delta)
					const ctx = new StreamEmitDataContext({
						chunk, chunks, answer, thoughts, thinking, delta, options
					})
					log.add(ctx)
					this.emitStreamData(log)
				}
			}
			const chunk = chunks[chunks.length - 1] ?? new ChatChunk()
			usage = new Usage({
				prompt_tokens: chat.count,
				completion_tokens: chunks.length,
				thoughts_tokens: thoughts.length,
				cached_tokens: chat.count,
				total_tokens: chat.count + chunks.length + -1,
			})
			const response = this.Response.from({
				content,
				role: this.Response.ROLES.assistant,
				response_id: chunk.id,
				model: chunk.model,
				count: usage.completion_tokens,
				usage,
				finish_reason: chunk.finish_reason,
				complete: true,
				spentMs: Date.now() - startedAt,
				startedAt: new Date(startedAt)
			}, model)

			log.end = new StreamEmitEndContext(
				{ options, chunks, answer, thoughts, content, response }
			)
			this.emitStreamEnd(log)
			return response
		} catch (err) {
			throw err
		} finally {
			this.requireEvents("stream.", true)
		}
	}

	/**
	 * Gets authorization headers
	 * @returns {object} Headers object
	 */
	_authHeader() {
		if (!this.auth?.apiKey) {
			return {}
		}
		return {
			'User-Agent': 'nan0web/1.0 (node; macOS 13.5)',
			'Authorization': `Bearer ${this.auth.apiKey}`,
		}
	}

	/**
	 * Decodes prompt to Prompt instance
	 * @param {ChatMessage|function} prompt ChatMessage or function
	 * @returns {ChatMessage} Message instance
	 */
	_decodePrompt(prompt) {
		let ChatMessage = /** @type {typeof ChatDriver} */ (this.constructor).Prompt
		if ("function" === typeof prompt && !(prompt instanceof ChatMessage)) {
			ChatMessage = prompt(this.model)
		}
		return ChatMessage.from(prompt)
	}

	/**
	 * Gets request options for API
	 * @param {ChatMessage|function} prompt ChatMessage or function
	 * @returns {object} Request options
	 */
	_request(prompt) {
		prompt = this._decodePrompt(prompt)
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...this._authHeader(),
			},
			body: JSON.stringify({
				model: this.model?.name || this.DEFAULT_MODEL,
				messages: prompt.toArray()
			})
		}
	}

	/**
	 * Gets chat completion endpoint URL
	 * @returns {string} Endpoint URL
	 */
	_chatCompletionEndpoint() {
		let endpoint = this.config?.chat?.endpoint
		if (endpoint) {
			return endpoint
		}
		return String(this.config.endpoint ?? this.DEFAULT_ENDPOINT).replace(/\/+$/, '') + '/chat/completions'
	}

	/**
	 * @param {StreamOptions} options
	 * @returns {AsyncGenerator<any, any, any>}
	 */
	async *createChatCompletionStream(options) {
		throw new Error("Abstract! Must be extended")
	}

	/**
	 * Prepares chat completion request
	 * @param {ChatMessage|string} prompt ChatMessage or function
	 * @returns {Promise<object>} Request options for fetch()
	 */
	async _chatCompletionRequest(prompt) {
		const endpoint = this._chatCompletionEndpoint()
		const data = await this.prepareRequest(prompt)
		return {
			endpoint,
			method: "POST",
			headers: {
				'Content-Type': 'application/json',
				...this._authHeader(),
			},
			body: JSON.stringify(data)
		}
	}

	/**
	 * Internal completion method
	 * @param {string|ChatMessage} prompt Input prompt
	 * @param {ChatModel} model Model to use
	 * @param {object} [context={}] Context for events
	 * @returns {Promise<Response | undefined>} Response
	 * @emits start {Object} Before starting request
	 * @emits completeInterval {Object} During request (every 99ms)
	 * @emits data {Object} On receiving data chunk
	 * @emits end {Response} On completion
	 * @emits error {Error} On error
	 */
	async _complete(prompt, model, context = {}) {
		prompt = ChatMessage.from(prompt)
		const id = /** @type {typeof ChatDriver} */ (this.constructor).uniqueID()
		const startedAt = Date.now()
		const eventData = { ...context, id, model, prompt, startedAt }

		this.emit('start', eventData)

		let i = 0
		const interval = setInterval(() => {
			this.emit('completeInterval', { ...eventData, i: i++ })
		}, 99)

		try {
			const { endpoint, ...rest } = await this._chatCompletionRequest(prompt)
			const res = await this.fetch(endpoint, rest)

			clearInterval(interval)

			if (!res.ok) {
				let errorData
				try {
					errorData = await res.json()
				} catch {
					errorData = await res.text()
				}
				const err = new Error(errorData?.error?.message || 'Unknown API error')
				this.emit('error', err)
				return Promise.reject(err)
			}

			let content = ''
			const Response = this.Response

			if (typeof res.body?.on === 'function') {
				res.body.on('data', chunk => {
					const chunkStr = chunk.toString()
					content += chunkStr
					this.emit('data', { ...eventData, chunk: chunkStr, content })
				})
				res.body.on('end', () => {
					const spentMs = Date.now() - startedAt
					const response = Response.from({ content, role: 'assistant', spentMs, request_id: id }, model)
					this.emit('end', response)
					return context.resolve ? context.resolve(response) : null
				})
				res.body.on('error', err => {
					this.emit('error', err)
					return context.reject ? context.reject(err) : null
				})
			} else {
				const data = await this._parseChatCompletionResponse(res)
				const content = data?.choices?.[0]?.message?.content ?? ""
				const spentMs = Date.now() - startedAt
				const response = Response.from({
					content,
					role: 'assistant',
					spentMs,
					request_id: id,
					response_id: data?.id ?? "",
					usage: data.usage ?? {},
					model: data?.model ?? this.model?.name,
				}, model)
				this.emit('end', response)
				return response
			}
		} catch (err) {
			clearInterval(interval)
			this.emit('error', err)
			return Promise.reject(err)
		}
	}

	/**
	 * Gets tokens for content
	 * @param {string} content Input content
	 * @returns {Promise<Array<number>>} Tokens
	 */
	async getTokens(content) {
		return encode(content)
	}

	/**
	 * Returns extra added tokens to remove from the max_tokens.
	 * Gpt-tokenizer throws an error if special tags included.
	 * @returns {Promise<array>} - The extra added tokens.
	 */
	async getAddedTokens() {
		return ['<' + '|start|' + '>', '<' + '|end|' + '>']
	}

	/**
	 * Returns the max_tokens value.
	 * @param {array|number} tokens The tokens array or its count.
	 */
	getMaxTokensOption(tokens = 0) {
		if (Array.isArray(tokens)) tokens = tokens.length
		const maxInput = this.config?.maxInput ?? this.model.context.input
		const maxOutput = this.config?.maxOutput ?? this.model.context.output
		const maxTokens = this.config?.maxTokens ?? this.model.context.window - tokens
		if (maxInput && Math.abs(tokens) > maxInput) {
			const format = new Intl.NumberFormat("en-US").format
			throw new RangeError(`Tokens count ${format(tokens)} is greater than maxInput ${format(maxInput)}`)
		}
		if (maxOutput) {
			return maxOutput - Math.abs(tokens)
		} else if (maxTokens) {
			return maxTokens - Math.abs(tokens)
		}
		return this.DEFAULT_MAX_TOKENS - Math.abs(tokens)
	}

	/**
	 * Returns the count of tokens in the prompt(s).
	 * @param {ChatMessage} prompt The prompt to weight.
	 * @returns {Promise<number>} The count of tokens, returns negative count in case of guessing,
	 *                            and positive if precise number is counted by LLM model.
	 */
	async getTokensCount(prompt) {
		const tokens = await this.getTokens(prompt.toString())
		return tokens.length
	}

	/**
	 * Deep merges multiple objects. Only objects are merged, other types are skipped.
	 * Priorty of merging: [0] <= [1] <= [2] <= [3], so [3] is the lowest in priority.
	 * @param {...Object} sources - The source objects to merge from.
	 * @returns {Object} The merged result
	*/
	merge(...sources) {
		let target = {}
		for (let i = sources.length - 1; i >= 0; i--) {
			let source = sources[i]
			if (Array.isArray(source) || "object" !== typeof source || null === source) {
				source = {}
				this.emit("merge.error", { target, source, i, message: "Source in not an Object" })
			}
			target = Data.merge(target, source)
		}
		return target
	}

	/**
	 * Prepare request for OpenRouter API
	 * @param {string|ChatMessage} prompt
	 * @param {ChatModel|string} [model]
	 * @param {boolean} [stream=false] - Whether this is a streaming request
	 * @returns {Promise<object>}
	 */
	async prepareRequest(prompt, model = this.model, stream = false) {
		prompt = this._decodePrompt(ChatMessage.from(prompt))
		const messages = prompt.toArray()
		const options = new Options()
		const defaultOpts = {
			...options,
			// @ts-ignore
			model: this.model?.name || this.constructor.DEFAULT_MODEL
		}
		const tokens = await this.getTokensCount(prompt)
		let maxTokens = this.getMaxTokensOption(tokens)
		const added = await this.getAddedTokens()
		maxTokens -= added.length
		const configOpts = {
			...this.options,
		}
		const reqOpts = { max_tokens: maxTokens, messages }
		/** @note Priority = request, config, default */
		return this.merge(reqOpts, configOpts, defaultOpts)
	}

	/**
	 * Gets embeddings for text
	 * @param {string|string[]} text Input text or array
	 * @param {boolean} [averageVector=false] Return average vector
	 * @returns {Promise<number[][]>} Embeddings
	 */
	async getEmbeddings(text, averageVector = false) {
		let endpoint = this.config.embedder?.endpoint
		if (!endpoint) {
			endpoint = this.config.endpoint ?? this.DEFAULT_ENDPOINT
			if (endpoint) endpoint = `${endpoint.replace(/\/$/, '')}/embeddings`
		}
		if (!endpoint) throw new Error('No endpoint')
		text = Array.isArray(text) ? text : [text]
		const result = []
		for (const str of text) {
			const res = await this.fetch(endpoint, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					...this._authHeader(),
				},
				body: JSON.stringify({ input: [`search_query: ${str}`] })
			})
			const data = await res.json()
			if (!data?.[0]?.embedding?.[0]) {
				throw new Error(data.error?.message || 'Invalid embedding response')
			}
			result.push(data[0].embedding[0])
		}
		return averageVector ? [this.average(result)] : result
	}

	/**
	 * Calculates average vector
	 * @param {Array<number[]>} vectors Input vectors
	 * @returns {number[]} Average vector
	 */
	average(vectors) {
		const length = vectors[0].length
		const sum = new Array(length).fill(0)

		for (const vec of vectors) {
			for (let i = 0; i < length; i++) {
				sum[i] += vec[i]
			}
		}

		return sum.map(val => val / vectors.length)
	}

	/**
	 * Finds driver for model
	 * @param {string} model - Model name
	 * @param {string} driver - Config options, might have {driver}.
	 * @returns {typeof ChatDriver|null} Driver class
	 */
	static findDriver(model, driver) {
		const drivers = Object.values(this.DRIVERS)
		if (driver) {
			for (const Driver of drivers) {
				if ([driver, driver + "Driver"].includes(Driver.name)) {
					return Driver
				}
			}
		}
		return null
	}

	/**
	 * @param {string} name - The driver name
	 * @returns {typeof ChatDriver|null} - ChatDriver class on success, null on
	 */
	static getDriver(name) {
		if (!name.endsWith("Driver")) name += "Driver"
		return this.DRIVERS[name] ?? null
	}

	/**
	 * Extracts files from response
	 * @param {Response} response Response object
	 * @returns {object} Files dictionary
	 */
	extractFiles(response) {
		return this.readCodeResponse(response.content)
	}

	/**
	 * Reads code blocks from text
	 * @param {string} text Input text
	 * @returns {object} Files dictionary
	 */
	readCodeResponse(text) {
		let current, files = {}
		text.split("\n").forEach((row, i) => {
			if (current) {
				if (current.type) {
					if ('```' === row) {
						const { file, ...obj } = current
						files[file] = obj
						current = null
					} else {
						current.data += row + "\n"
					}
				} else {
					if (row.startsWith('```')) {
						current.type = row.slice(3)
					}
				}
			} else {
				if (row.startsWith('`') && row.endsWith('`:')) {
					current = { file: row.slice(1, -2), data: '', type: null }
				}
			}
		})
		return files
	}

	/**
	 * Parses completion response
	 * @param {object} res API response
	 * @param {object} [context={}] Context object
	 * @returns {Promise<object>} Parsed data
	 */
	async _parseChatCompletionResponse(res, context = {}) {
		if ('string' === typeof res) {
			return this._parseChatCompletionResponseText(res, context)
		}
		try {
			const data = await res.json()
			return data
		} catch (err) {
			const text = await res.text()
			return this._parseChatCompletionResponseText(text, context)
		}
	}

	/**
	 * Parses completion text
	 * @param {string} text Response text
	 * @param {object} [context={}] Context object
	 * @returns {object | null} Parsed data
	 */
	_parseChatCompletionResponseText(text, context = {}) {
		const needle = '\n\ndata: ';
		let count = 0;
		let pos = 0;

		while ((pos = text.indexOf(needle, pos)) !== -1) {
			count++;
			pos += needle.length;
		}
		if (!count) {
			let str = text.trim()
			if (str.startsWith("data: ")) {
				str = str.slice(5).trim()
				if ('[DONE]' === str) {
					return null
				}
			}
			try {
				const data = JSON.parse(str)
				return data
			} catch {
				return null
			}
		}
		const rows = text.split("\n\n")
		context.first = null
		context.last = null
		let content = ""
		let result
		for (const row of rows) {
			const data = this._parseChatCompletionResponseText(row)
			if (null === data) continue
			if (null === context.first && data.created) {
				context.first = data.created
			}
			const chunk = data?.choices?.[0]?.delta?.content ?? null
			if ([null, undefined].includes(chunk)) {
				result = data
				context.last = data.created
			} else {
				content += chunk
			}
		}
		result.content = content
		if (result.id && !result.response_id) result.response_id = result.id
		return result
	}

	/**
	 * @param {object} input
	 * @returns {ChatDriver}
	 */
	static from(input) {
		if (input instanceof ChatDriver) return input
		return new ChatDriver(input ?? {})
	}
}
