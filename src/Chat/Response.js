import { NonEmptyObject, to } from "@nan0web/types"
import ChatMessage from "./Message.js"
import ChatModel from "./Model/Model.js"
import ChatUsage from "./Usage.js"

/**
 * Represents a chat response with additional metadata
 */
class ChatResponse extends ChatMessage {
	static ALIAS = {
		responseId: 'response_id',
		requestId: 'request_id',
		finishReason: 'finish_reason'
	}
	/** @type {string} **/
	thought
	/** @type {string} **/
	request_id
	/** @type {string} **/
	response_id
	/** @type {string} **/
	model
	/** @type {ChatUsage} **/
	usage
	/** @type {string} **/
	finish_reason
	/** @type {boolean} **/
	complete
	/** @type {number} **/
	spentMs
	/** @type {Date} **/
	startedAt

	/**
	 * @param {Partial<ChatResponse>} input
	 * @param {string | ChatModel} [model]
	 */
	constructor(input, model) {
		if ("string" === typeof input) {
			input = { content: input }
		}
		super(input)
		const {
			thought = "",
			request_id = "",
			response_id = "",
			model: modelName = "",
			usage = new ChatUsage(),
			finish_reason = "",
			complete = false,
			spentMs = 0,
			startedAt = new Date(),
		} = input
		this.thought = thought
		this.request_id = request_id
		this.response_id = response_id
		this.model = modelName
		this.usage = ChatUsage.from(usage)
		this.finish_reason = finish_reason
		this.complete = complete
		this.spentMs = spentMs
		this.startedAt = new Date(startedAt)
		this.sanitize()
		if (model) {
			if (!(model instanceof ChatModel)) {
				throw new Error("Model must be ChatModel instance")
			}
			this.model = model.name
			if (this.usage) {
				model.calc(this.usage)
			}
		}
	}

	/**
	 * Creates response from various input types
	 * @param {object|string|ChatMessage} input Response data
	 * @param {ChatModel} [model] Model for cost calculation
	 * @returns {ChatResponse} Response instance
	 */
	static from(input, model) {
		if (input instanceof ChatResponse) return input
		if (model) {
			if (!input.model) {
				input.model = model.name
			}
		}
		if ("object" === typeof input) {
			for (const [key, value] of Object.entries(this.ALIAS)) {
				if (undefined !== input[key]) {
					input[value] = input[key]
				}
			}
		}
		const response = new this(input, model)
		if (model && response.usage) {
			model.calc(response.usage)
		}
		return response
	}

	sanitize() {
		const rows = String(this.content ?? "").split("\n")
		let thinking = rows[0] === '<tool_call>'
		if (!thinking) {
			return
		}
		const thought = [], content = []
		rows.forEach((row, i) => {
			if (thinking) {
				if ('<tool_call>' === row) {
					thinking = false
				} else if (i) {
					thought.push(row)
				}
			} else {
				content.push(row)
			}
		})
		this.thought = thought.join("\n")
		this.content = content.join("\n")
	}

	get speed() {
		return 1000 * this.usage.total_tokens / this.spentMs
	}

	static fromLog(log) {
		let stats = {}
		const rows = String(log).split("\n")
		if (rows.length && rows[0].startsWith("<!-- {") && rows[0].endsWith("} -->")) {
			stats = JSON.parse(rows[0].slice(5, -4))
			log = rows.slice(1).join("\n").trim()
		}
		const message = ChatMessage.fromLog(log)
		return new this(
			{ ...stats, ...to(Object)(message), role: ChatMessage.ROLES.assistant }
		)
	}

	toLog() {
		if (this.empty) {
			return ""
		}
		const stats = to(Object)(to(NonEmptyObject)({
			thought: this.thought,
			request_id: this.request_id,
			response_id: this.response_id,
			model: this.model,
			usage: this.usage.toObject(),
			finish_reason: this.finish_reason,
			complete: this.complete,
			spentMs: this.spentMs,
			startedAt: this.startedAt,
			username: this.username,
			size: this.size,
		}))
		return [
			`<!-- ${JSON.stringify(stats)} -->`,
			super.toLog()
		].join("\n")
	}
}

export default ChatResponse