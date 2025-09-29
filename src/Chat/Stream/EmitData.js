// import { NANOElement } from "nano-format/elements"
import ChatChunk from "./Chunk.js"

/**
 * @typedef {Object} ChatEmitDataProps
 * @property {string} [id] - Chat session ID
 * @property {number} [startedAt] - Timestamp when the chat started
 * @property {ChatChunk} [chunk] - The chunk data containing id and choices
 * @property {number} [created] - Timestamp when the chunk was created
 * @property {string} [model] - Model name used
 * @property {string} [object] - Type of the response object
 * @property {string} [service_tier] - Service tier (e.g., 'pro', 'free')
 * @property {string} [system_fingerprint] - System fingerprint
 */

/**
 * Represents data related to a single data emit during stream.
 */
class ChatEmitData {
	/** @type {string} */
	chatId
	/** @type {number} */
	startedAt

	/**
	 * Constructs a new ChatEmitData instance.
	 *
	 * @param {ChatEmitDataProps} [props={}] - The data used to initialize the event.
	 */
	constructor(props = {}) {
		const {
			chatId,
			startedAt,
		} = props
		this.chatId = String(chatId)
		this.startedAt = Number(startedAt)
	}

	/**
	 * Creates a ChatEmitData instance from the given input.
	 *
	 * @param {ChatEmitData | ChatEmitDataProps} [props={}] - Existing instance or raw data.
	 * @returns {ChatEmitData}
	 */
	static from(props = {}) {
		if (props instanceof ChatEmitData) {
			return props
		}
		return new this(props)
	}
}

export default ChatEmitData
