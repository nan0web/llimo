import ChatChoice from './Choice.js'

class ChatChunk {
	/** @type {string} */
	id
	/** @type {string} */
	object
	/** @type {number} */
	created
	/** @type {string} */
	model
	/** @type {string} */
	finish_reason
	/** @type {string} */
	service_tier
	/** @type {string} */
	system_fingerprint
	/** @type {ChatChoice[]} */
	choices
	/** @type {number} */
	count

	/**
	 * @param {object} [props]
	 * @param {string} [props.id=""]
	 * @param {string} [props.object=""]
	 * @param {number} [props.created=0]
	 * @param {string} [props.model=""]
	 * @param {string} [props.service_tier=""]
	 * @param {string} [props.finish_reason=""]
	 * @param {string} [props.system_fingerprint=""]
	 * @param {Array<object|ChatChoice>} [props.choices=[]]
	 */
	constructor(props = {}) {
		const {
			id = '',
			object = '',
			created = 0,
			model = '',
			service_tier = '',
			finish_reason = '',
			system_fingerprint = '',
			choices = [],
		} = props

		this.id = id
		this.object = String(object)
		this.created = Number(created)
		this.model = String(model)
		this.service_tier = String(service_tier)
		this.finish_reason = String(finish_reason)
		this.system_fingerprint = String(system_fingerprint)
		this.choices = Array.isArray(choices) ? choices.map(c => ChatChoice.from(c)) : []
		this.count = this.choices.reduce((acc, choice) => choice.delta.content.split(" ").length, 0)
	}

	toString() {
		if (1 === this.choices.length) {
			return this.choices[0].delta
		}
		return this.choices.length + " choices"
	}

	/**
	 * Create ChatChunk from plain object or return if already instance.
	 * @param {object|ChatChunk} props
	 * @returns {ChatChunk}
	 */
	static from(props = {}) {
		if (props instanceof ChatChunk) return props
		return new this(props)
	}
}

export default ChatChunk
