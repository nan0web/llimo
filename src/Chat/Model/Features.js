export default class ModelFeatures {
	/** @type {boolean} */
	chatCompletions
	/** @type {boolean} */
	assistants
	constructor(props = {}) {
		const {
			chatCompletions = false,
			assistants = false,
		} = props
		this.chatCompletions = Boolean(chatCompletions)
		this.assistants = Boolean(assistants)
	}
	toString() {
		const arr = [
			this.chatCompletions ? "chat" : "",
			this.assistants ? "assistant" : "",
		].filter(Boolean)
		return arr.length ? arr.join(", ") : "-- no features --"
	}
	static from(props = {}) {
		if (props instanceof ModelFeatures) return props
		return new this(props)
	}
}
