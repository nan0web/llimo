import { ObjectWithAlias } from "@nan0web/types"

class ModelPrices extends ObjectWithAlias {
	static ALIAS = {
		i: "input",
		o: "output",
		db: "cache",
	}
	static SAVE_FIRST_PROP = "output"
	/** @type {number} */
	input
	/** @type {number} */
	output
	/** @type {number} */
	cache
	/** @type {number} */
	batchDiscount
	/** @type {number} */
	speed
	/** @type {string} */
	currency
	/**
	 * @param {string} uri
	 * @param {object} props
	 */
	constructor(props = {}) {
		super(props)
		const {
			input = -1,
			output = -1,
			cache = 0,
			batchDiscount = 0,
			speed = 0,
			currency = "USD"
		} = props
		this.input = Number(input)
		this.output = Number(output)
		this.cache = Number(cache)
		this.batchDiscount = Number(batchDiscount)
		this.speed = Number(speed)
		this.currency = String(currency)
	}
	toString() {
		const format = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: this.currency,
		}).format
		if (this.input === this.output) {
			return `${format(this.output)} 1MT`
		}
		return `(${format(this.input)} ${format(this.output)} 1MT)`
	}
	static from(props = {}) {
		if (props instanceof ModelPrices) return props
		return super.from(props)
	}
}

export default ModelPrices
