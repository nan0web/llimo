import ChatDelta from "./Delta.js"

class ChatChoice {
	/** @type {ChatDelta} */
	delta
	/** @type {string|null} */
	finish_reason
	/** @type {number} */
	index
	/** @type {string|null} */
	logprobs
	constructor(props = {}) {
		const {
			delta = {},
			finish_reason = null,
			index = 0,
			logprobs = null
		} = props
		this.delta = ChatDelta.from(delta)
		this.finish_reason = finish_reason
		this.index = Number(index)
		this.logprobs = logprobs
	}
	/**
	 * Create ChatChoice from plain object or return if already instance.
	 *
	 * @param {object} props - Properties of the chat choice.
	 * @param {object|ChatDelta} props.delta - Partial message content.
	 * @param {string|null} props.finish_reason - Reason for completion.
	 * @param {number} props.index - Index of the choice.
	 * @param {string|null} [props.logprobs] - Optional logprobs information.
	 * @returns {ChatChoice}
	 */
	static from(props) {
		if (props instanceof ChatChoice) {
			return props
		}
		return new this(props)
	}
}

export default ChatChoice
