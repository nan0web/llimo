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
	constructor(props = {}) {
		const {
			name = "",
			window = 0,
			input,
			output = 0,
			date = "",
		} = props
		this.name = String(name)
		this.window = Number(window)
		this.output = Number(output)
		this.input = Number(input ?? (this.window - this.output))
		this.date = String(date)
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
		return `${format(this.window)} > ${format(this.output)}T ${this.date}`
	}
	static from(props = {}) {
		if (props instanceof ModelContext) return props
		return new this(props)
	}
}

export default ModelContext
