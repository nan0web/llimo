import ChatDriver from "./ChatDriver.js"
import ChatChunk from "../Stream/Chunk.js"
import StreamOptions from "../Stream/Options.js"
import Response from "../Response.js"
import ChatResponse from "../Response.js"
import ChatUsage from "../Usage.js"
import ChatMessage from "../Message.js"

class OpenRouterError extends Error {
	/** @type {number} */
	code
	/** @type {object} */
	metadata
	/**
	 * @param {string | object} input
	 * @param {ErrorOptions} [options]
	 */
	constructor(input, options) {
		if ("string" === typeof input) {
			input = {
				message: input
			}
		}
		super(input.message, options)
		const {
			code = 400,
			metadata = {},
		} = input
		this.code = Number(code)
		this.metadata = metadata
	}
	static from(input = {}) {
		if (input instanceof OpenRouterError) return input
		return new OpenRouterError(input)
	}
}

class OpenRouterDriver extends ChatDriver {
	/** @param {import("openai").ClientOptions} [options] */
	constructor(options = {}) {
		options.baseURL = "https://openrouter.ai/api/v1"
		super(options)
	}

	/**
	 * Custom fetch method for OpenRouter endpoints
	 * @param {string} uri
	 * @param {RequestInit} [options={}]
	 * @returns {Promise<any>}
	 */
	async myFetch(uri, options = {}) {
		options.method = options.method ?? "GET"
		options.headers = {
			"Authorization": `Bearer ${this.apiKey}`,
			"Content-Type": "application/json",
			...options.headers,
		}

		const response = await fetch(this.baseURL + uri, options)
		if (options.responseOnly) {
			return response
		}
		let result
		try {
			result = await response.json()
		} catch (err) {
			try {
				result = await response.text()
			} catch (fetchErr) {
				this.logger.error(fetchErr.message)
				this.logger.debug(fetchErr.stack)
			}
		}
		return result
	}

	/**
	 * Fetch rate limit and credits information for the API key
	 * @returns {Promise<{data: {label: string, usage: number, limit: number|null, is_free_tier: boolean}}>}
	 */
	async checkKey() {
		return await this.myFetch("/key")
	}

	/**
	 * Fetch sorted list of available providers
	 * @returns {Promise<Array<{name: string, id: string}>>}
	 */
	async getProviders() {
		const result = await this.myFetch("/providers")
		if (!result?.data) {
			return []
		}
		result.data.sort((a, b) => String(a.name).localeCompare(String(b.name)))
		return result.data
	}

	/**
	 * Fetch credits usage information
	 * @returns {Promise<{total_credits: number, total_usage: number}>}
	 */
	async getCredits() {
		const result = await this.myFetch("/credits")
		return result?.data ?? { total_credits: 0, total_usage: 0 }
	}

	/**
	 * Create a streaming chat completion with provider support
	 * @param {StreamOptions} options
	 * @returns {AsyncIterable<ChatChunk>}
	 */
	async *createChatCompletionStream(options) {
		const body = {
			model: options.model,
			messages: options.messages,
			stream: options.stream,
			temperature: options.temperature,
			max_tokens: options.max_tokens,
			top_p: options.top_p,
		}

		if (options.provider) {
			body.provider = { order: [options.provider] }
		}

		const startedAt = new Date()
		const request_id = Date.now()

		const response = await this.myFetch("/chat/completions", {
			method: "POST",
			body: JSON.stringify(body),
			responseOnly: true,
		})

		if (!response.body) {
			if (response.error) {
				throw OpenRouterError.from(response.error)
			}
			throw new Error("Response body is not readable")
		}

		const chunks = []
		const reader = response.body.getReader()
		const decoder = new TextDecoder()
		let buffer = ""

		try {
			while (true) {
				const { done, value } = await reader.read()
				if (done) break

				const chunk = decoder.decode(value, { stream: true })
				buffer += chunk

				while (true) {
					const lineEnd = buffer.indexOf("\n")
					if (lineEnd === -1) {
						if (buffer.startsWith("{") && buffer.endsWith("}")) {
							let data = { error: { message: "Cannot process chunk", stack: buffer } }
							try {
								data = JSON.parse(buffer)
							} catch {
							}
							if (data.error) {
								throw OpenRouterError.from(data.error)
							}
							const lastChunk = ChatChunk.from(data ?? {})
							chunks.push(lastChunk)
							const choice = lastChunk.choices[lastChunk.choices.length - 1] ?? null
							if (choice) {
								/** @type {ChatMessage} */
								let message
								if (data.choices?.[0]?.message) {
									message = ChatMessage.from(data.choices[0].message)
								} else {
									message = ChatMessage.from({
										role: ChatMessage.ROLES.assistant,
										content: chunks.map(ch => ch.choices.map(c => c.delta).join("")).join("")
									})
								}
								const response = new ChatResponse({
									...message,
									finish_reason: choice.finish_reason,
									model: lastChunk.model,
									request_id,
									response_id: lastChunk.id,
									startedAt,
									// @todo add though and usage and calculate with ensureTokensCount if no such data provided.
									thought: "",
									usage: new ChatUsage(),
								})
								yield response
							}
						}
						break
					}

					const line = buffer.slice(0, lineEnd).trim()
					buffer = buffer.slice(lineEnd + 1)

					if (line.startsWith("data: ")) {
						const data = line.slice(6)
						if (data === "[DONE]") return

						try {
							const parsed = JSON.parse(data)
							const chunk = ChatChunk.from(parsed)
							chunks.push(chunk)
							// @todo implement Chunks and Usage and Response.
							yield chunk
						} catch (e) {
							// Ignore invalid JSON
						}
					}
				}
			}
		} finally {
			reader.releaseLock()
		}
	}

	/**
	 * Stream function following OpenAIDriver algorithm
	 * @param {import("../Message.js")} chat
	 * @param {import("../Model.js")} model
	 * @param {Function} onData callback for each delta chunk
	 * @returns {Promise<Response>}
	 */
	async stream(chat, model, onData = delta => undefined) {
		return await super.stream(chat, model, onData)
	}
}

export default OpenRouterDriver
