import ChatMessage from "./Message.js"
/**
 * Represents token usage statistics
 */
class ChatUsage {
	/** @type {Number} */
	prompt_tokens
	/** @type {Number} */
	completion_tokens
	/** @type {Number} */
	thoughts_tokens
	/** @type {Number} */
	cached_tokens
	/** @type {Number} */
	total_tokens
	/** @type {Number} */
	cost
	/**
	 * @param {object} input
	 * @param {number} [input.prompt_tokens]
	 * @param {number} [input.completion_tokens]
	 * @param {number} [input.thoughts_tokens]
	 * @param {number} [input.cached_tokens]
	 * @param {number} [input.total_tokens]
	 * @param {number} [input.cost]
	 */
	constructor(input = {}) {
		const {
			prompt_tokens = 0,
			completion_tokens = 0,
			thoughts_tokens = 0,
			cached_tokens = 0,
			total_tokens = 0,
			cost = 0,
		} = input
		this.prompt_tokens = Number(prompt_tokens)
		this.completion_tokens = Number(completion_tokens)
		this.thoughts_tokens = Number(thoughts_tokens)
		this.cached_tokens = Number(cached_tokens)
		this.total_tokens = Number(total_tokens)
		this.cost = Number(cost)
	}

	/**
	 * Gets input tokens count
	 * @returns {number} Input tokens
	 */
	get tokensIn() {
		return this.prompt_tokens
	}

	/**
	 * Gets output tokens count
	 * @returns {number} Output tokens
	 */
	get tokensOut() {
		return this.completion_tokens
	}

	/**
	 * Gets total tokens count
	 * @returns {number} Total tokens
	 */
	get total() {
		return this.tokensIn + this.tokensOut
	}

	/**
	 * Returns formatted usage string
	 * @returns {string} Formatted usage info
	 */
	toString() {
		const format = new Intl.NumberFormat('en-US').format
		const str = format(this.total) + ` tokens (→ ${format(this.tokensIn)} ← ${format(this.tokensOut)})`
		if (!this.cost) return str
		return str + ` $${this.cost.toFixed(4)} USD`
	}
	toObject() {
		return {
			prompt_tokens: Number(this.prompt_tokens),
			completion_tokens: Number(this.completion_tokens),
			thoughts_tokens: Number(this.thoughts_tokens),
			cached_tokens: Number(this.cached_tokens),
			total_tokens: Number(this.total_tokens),
			cost: Number(this.cost)
		}
	}
	static from(props) {
		if (props instanceof ChatUsage) return props
		if (props instanceof ChatMessage) {
			return new this({
				prompt_tokens: props.count,
				cached_tokens: props.count,
				total_tokens: props.count,
			})
		}
		return new this(props)
	}
}

export default ChatUsage
