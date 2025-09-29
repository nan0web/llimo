import DriverOptions from "../Options.js"

class OpenRouterOptions extends DriverOptions {
	/** @type {string} */
	endpoint
	/** @type {string} */
	referer
	/** @type {string} */
	title
	/** @type {number} */
	timeout
	/** @type {boolean} */
	useCache

	/**
	 * @param {Object} input
	 * @param {number} [input.temperature]
	 * @param {number} [input.max_tokens]
	 * @param {number} [input.top_p]
	 * @param {string} [input.endpoint=""]
	 * @param {string} [input.referer=""]
	 * @param {string} [input.title=""]
	 * @param {number} [input.timeout=30_000]
	 * @param {boolean} [input.useCache=false]
	 */
	constructor(input = {}) {
		const {
			temperature,
			max_tokens,
			top_p,
			endpoint = "",
			referer = "",
			title = "",
			timeout = 30_000,
			useCache = false
		} = input
		super({ temperature, max_tokens, top_p })
		this.endpoint = endpoint
		this.referer = referer
		this.title = title
		this.timeout = timeout
		this.useCache = useCache
	}

	/**
	 * @param {any} input
	 * @returns {OpenRouterOptions}
	 */
	static from(input) {
		if (input instanceof OpenRouterOptions) return input
		return new this(input)
	}
}

export default OpenRouterOptions
