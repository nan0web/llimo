// import { NANOElement } from "nano-format/elements"
import ChatChoice from "./Choice.js"
import ChatChunk from "./Chunk.js"

/**
 * @typedef {Object} ChatEventDataProps
 * @property {string} [id] - Chat session ID
 * @property {number} [startedAt] - Timestamp when the chat started
 * @property {ChatChunk} [chunk] - The chunk data containing id and choices
 * @property {ChatChunk[]} [chunks=[]]
 * @property {ChatChunk[]} [answer=[]]
 * @property {ChatChunk[]} [thoughts=[]]
 * @property {boolean} [thinking=false]
 * @property {string} [delta=""]
 * @property {Object} [options={}]
 * @property {number} [created] - Timestamp when the chunk was created
 * @property {string} [model] - Model name used
 * @property {string} [object] - Type of the response object
 * @property {string} [service_tier] - Service tier (e.g., 'pro', 'free')
 * @property {string} [system_fingerprint] - System fingerprint
 */

/**
 * Represents data related to a single chat event.
 */
class ChatEventData {
	/** @type {string} */
	chatId
	/** @type {number} */
	startedAt

	/** @type {ChatChunk} */
	chunk
	/** @type {ChatChunk[]} */
	chunks
	/** @type {ChatChunk[]} */
	answer
	/** @type {ChatChunk[]} */
	thoughts
	/** @type {boolean} */
	thinking
	/** @type {Object} */
	options = {}

	/** @type {string} */
	id
	/** @type {ChatChoice[]} */
	choices
	/** @type {number} */
	created
	/** @type {string} */
	model
	/** @type {string} */
	object
	/** @type {string} */
	service_tier
	/** @type {string} */
	system_fingerprint

	/**
	 * Constructs a new ChatEventData instance.
	 *
	 * @param {ChatEventDataProps} [props={}] - The data used to initialize the event.
	 */
	constructor(props = {}) {
		const {
			startedAt = 0,

			chunk = {},
			chunks = [],
			answer = [],
			thoughts = [],
			thinking = false,
			delta = "",
			options = {},

			id = "",
			created = 0,
			model = "",
			object = "",
			service_tier = "",
			system_fingerprint = "",
		} = props

		this.chatId = String(id)
		this.startedAt = Number(startedAt)
		const chatChunk = ChatChunk.from(chunk)

		this.id = String(chatChunk.id || "")
		this.choices = Array.isArray(chatChunk.choices) ? chatChunk.choices.map(ChatChoice.from) : []
		this.created = Number(created)
		this.model = String(model)
		this.object = String(object)
		this.service_tier = String(service_tier)
		this.chunk = ChatChunk.from(chunk)
		this.chunks = chunks
		this.answer = answer
		this.thoughts = thoughts
		this.thinking = Boolean(thinking)
		this.delta = String(delta)
		this.options = options
		this.system_fingerprint = String(system_fingerprint)
	}

	/**
	 * Creates a ChatEventData instance from the given input.
	 *
	 * @param {ChatEventData | ChatEventDataProps} [props={}] - Existing instance or raw data.
	 * @returns {ChatEventData}
	 */
	static from(props = {}) {
		if (props instanceof ChatEventData) {
			return props
		}
		return new this(props)
	}
}

export default ChatEventData
