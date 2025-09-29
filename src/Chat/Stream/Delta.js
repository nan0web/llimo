class ChatDelta {
	/** @type {string} */
	content
	/** @type {string|null} */
	refusal
	/** @type {string|null} */
	role
	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { content: props }
		}
		const {
			content = "",
			refusal = null,
			role = null,
		} = props
		this.content = content
		this.refusal = refusal
		this.role = role
	}
	toString() {
		return this.content
	}
	static from(props = {}) {
		if (props instanceof ChatDelta) {
			return props
		}
		return new this(props)
	}
}

export default ChatDelta
