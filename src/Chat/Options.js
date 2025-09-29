class ChatOptions {
	static DEFAULTS = {
		temperature: 0.3,
		max_tokens: 256,
		top_p: 0.9
	}
	/** @type {number} */
	temperature
	/** @type {number} */
	max_tokens
	/** @type {number} */
	top_p

	constructor(props = {}) {
		const {
			temperature = ChatOptions.DEFAULTS.temperature,
			max_tokens = ChatOptions.DEFAULTS.max_tokens,
			top_p = ChatOptions.DEFAULTS.top_p
		} = props
		this.temperature = Number(temperature)
		this.max_tokens = Number(max_tokens)
		this.top_p = Number(top_p)
	}
	toString() {
		const format = new Intl.NumberFormat("en-US").format
		return `${this.temperature}˚C ${format(this.max_tokens)}T ${this.top_p}∆`
	}
}

export default ChatOptions
