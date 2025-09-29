import ChatMessage from "../Message.js"

class StreamOptions {
	#noTempModels = [
		"o1", "o1-mini",
		"deepseek-ai/deepseek-prover-v2-671b",
		"Qwen/Qwen3-32B"
	]
	#noSystemModels = ["o1-mini"]
	/** @type {string} */
	model
	/** @type {Array<{role: string, content: string}>} */
	messages
	/** @type {boolean} */
	stream
	/** @type {number | undefined} */
	temperature
	/** @type {number} */
	max_tokens
	/** @type {number} */
	top_p

	/**
	 * @param {object} props
	 * @param {string} props.model
	 * @param {Array<{role: string, content: string}>} props.messages
	 * @param {boolean} props.stream
	 * @param {number} props.temperature
	 * @param {number} props.max_tokens
	 * @param {number} props.top_p
	 */
	constructor(props = {}) {
		const {
			model,
			messages = [],
			stream,
			temperature,
			max_tokens,
			top_p,
		} = props
		this.model = model
		this.messages = messages
		this.stream = stream
		this.temperature = temperature
		this.max_tokens = max_tokens
		this.top_p = top_p

		const str = String(this.model).toLocaleLowerCase()
		if (this.#noTempModels.includes(str)) {
			this.temperature = undefined
		}
		if (this.#noSystemModels.includes(str)) {
			this.messages.map(
				m => m.role = m.role === ChatMessage.ROLES.system ? ChatMessage.ROLES.user : m.role
			)
		}
	}
	static from(props) {
		if (props instanceof StreamOptions) return props
		return new this(props)
	}
}

export default StreamOptions
