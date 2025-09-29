/**
 * @typedef {object} Context
 * @property {String} [name=""]
 * @property {Number} [window=0]
 * @property {Number} [input=0]
 * @property {Number} [output=0]
 * @property {Boolean} [isModerated=false]
 * @property {String} [date=""]
 */
class ModelContext {
	/** @type {String} */
	name
	/** @type {Number} */
	window
	/** @type {Number} */
	input
	/** @type {Number} */
	output
	/** @type {String} */
	date
	/**
	 * @param {Context} props
	 */
	constructor(props = {}) {
		const {
			name = "",
			window = 0,
			input,
			output = 0,
			date = "",
			isModerated = false,
		} = props
		this.name = String(name)
		this.window = Number(window)
		this.output = Number(output)
		this.input = Number(input ?? (this.window - this.output))
		this.date = String(date)
		this.isModerated = Boolean(isModerated)
	}
	get empty() {
		return 0 === this.output && 0 === this.window && 0 === this.input
	}
	/**
	 * @param {number} tokensCount
	 * @returns {number}
	 */
	available(tokensCount = 0) {
		return this.window - this.output - tokensCount
	}
	toString() {
		const format = new Intl.NumberFormat("en-US").format
		return `${format(this.window)} > ${format(this.output)}T ${this.date}`.trim()
	}
	/**
	 * @param {Context | object} props
	 * @returns {ModelContext}
	 */
	static from(props = {}) {
		if (props instanceof ModelContext) return props
		return new this(props)
	}
}

export default ModelContext
