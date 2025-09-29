class DriverOptions {
	/** @type {number | undefined} */
	temperature
	/** @type {number | undefined} */
	max_tokens
	/** @type {number | undefined} */
	top_p
	/** @type {string | undefined} */
	provider
	/**
	 *
	 * @param {object} [props]
	 * @param {number} [props.temperature]
	 * @param {number} [props.max_tokens]
	 * @param {number} [props.top_p]
	 * @param {string} [props.provider]
	 */
	constructor(props = {}) {
		const {
			temperature,
			max_tokens,
			top_p,
			provider,
		} = props
		this.temperature = temperature
		this.max_tokens = max_tokens
		this.top_p = top_p
		this.provider = provider
	}
	/**
	 * @param {any} input
	 * @returns {DriverOptions}
	 */
	static from(input) {
		if (input instanceof DriverOptions) return input
		return new DriverOptions(input ?? {})
	}
}

export default DriverOptions
