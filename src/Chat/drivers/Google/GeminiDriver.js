import ChatDriver from "../ChatDriver.js"
import Model from "../../Model.js"
import GeminiPrompt from "./Prompt.js"
import GeminiResponse from "./Response.js"

/**
 * Driver for Google Gemini API
 */
class GeminiDriver extends ChatDriver {
	static Prompt = GeminiPrompt
	static Response = GeminiResponse
	static DEFAULT_MODEL = "gemini-2.5-pro"
	static DEFAULT_ENDPOINT = "https://generativelanguage.googleapis.com/v1beta/models/"
	static MODELS = {
		gemini_2_5_flash: Model.from({
			name: "gemini-2.5-flash-preview-05-20", maxContext: 128_000, maxOutput: 128_000,
			costIn: 0.15, costOut: 0.6, currency: "USD",
			rpm: [1_000, 2_000, 10_000],
			rpd: [10_000, 100_000, 999_999_999],
			tpm: [1_000_000, 3_000_000, 8_000_000],
		}),
		gemini_2_5_pro: Model.from({
			name: "gemini-2.5-pro-preview-06-05", maxContext: 128_000, maxOutput: 128_000,
			costIn: 1.25, costOut: 10.0, currency: "USD",
			rpm: [150, 1_000, 2_000],
			rpd: [1_000, 50_000, 999_999_999],
			tpm: [2_000_000, 5_000_000, 8_000_000],
		}),
	}

	/**
	 * Completes prompt using Gemini model
	 * @param {string|Prompt} prompt Input prompt
	 * @param {Model} model Model to use
	 * @param {object} [context={}] Context for events
	 * @returns {Promise<Response>} Response
	 * @emits start {Object} Before starting request
	 * @emits completeInterval {Object} During request (every 99ms)
	 * @emits data {Object} On receiving data chunk
	 * @emits end {Response} On completion
	 * @emits error {Error} On error
	 */
	async complete(prompt, model, context = {}) {
		const id = this.constructor.uniqueID()
		return new Promise(async (resolve, reject) => {
			const url = this.config.endpoint || this.constructor.DEFAULT_ENDPOINT
			const startedAt = Date.now()
			const eventData = { ...context, id, url, model, prompt, startedAt }
			this.emit('start', eventData)
			let i = 0
			const interval = setInterval(() => {
				this.emit('completeInterval', { ...eventData, i: i++ })
			}, 99)
			const res = await this.fetch(`${url}${this.model.name || GeminiDriver.DEFAULT_MODEL}:generateContent?key=${this.config.auth.token}&alt=sse`, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }]
				})
			})
			clearInterval(interval)
			if (!res.ok) {
				const errorData = await res.json()
				throw new Error(errorData.error.message)
			}

			const spentMs = Date.now() - startedAt
			const Response = this.constructor.Response

			const decodeResponse = (data) => {
				const role = 'assistant'
				content = data.candidates[0].content.parts[0].text
				const props = { ...data, content, role, finishReason: data.candidates[0].finishReason, spentMs }
				if (!props.request_id) props.request_id = eventData.id
				return Response.from(props, this.model)
			}

			let content = ''
			try {
				const data = await res.json()
				const response = decodeResponse(data)
				this.emit('end', response)
				return resolve(response)
			} catch (err) {
				const text = await res.text()
				if (text.startsWith("data: ")) {
					const data = JSON.parse(text.slice(5))
					const response = decodeResponse(data)
					this.emit('data', { ...eventData, chunk: response.content, content: response.content, id })
					this.emit('end', response)
					return resolve(response)
				}
				this.emit('error', err)
				return reject(err)
			}
		})
	}
}

export default GeminiDriver
