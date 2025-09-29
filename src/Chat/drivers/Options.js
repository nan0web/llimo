class DriverOptions {
	/** @type {number} */
	temperature
	/** @type {number} */
	max_tokens
	/** @type {number} */
	top_p
	/**
	 *
	 * @param {object} props
	 * @param {number} props.temperature
	 * @param {number} props.max_tokens
	 * @param {number} props.top_p
	 */
	constructor(props = {}) {
		const {
			temperature = 0,
			max_tokens,
			top_p,
		} = props
		this.temperature = temperature
		this.max_tokens = max_tokens
		this.top_p = top_p
	}
}

export default DriverOptions
