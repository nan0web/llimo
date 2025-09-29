import { empty, typeOf } from "@nan0web/types"
import ModelContext from "./Model/Context.js"
import ModelFeatures from "./Model/Features.js"
import ModelPrices from "./Model/Prices.js"
import Usage from "./Usage.js"

const ModelFormat = arr => arr?.filter?.(a => ["image", "text"].includes(a)) ?? []

/**
 * Represents a chat model with pricing and token limits
 */
class ChatModel {
	static FORMATS = ["image", "text"]
	/** @type {string} */
	name
	/** @type {string} */
	provider
	/** @type {ModelContext} */
	context
	/** @type {ModelFeatures} */
	features
	/** @type {ModelPrices} */
	prices
	/** @type {string[]} */
	input
	/** @type {string[]} */
	output
	/** @type {string} */
	currency

	constructor(props = {}) {
		const {
			name,
			provider = "",
			context,
			features,
			prices,
			input,
			output,
			currency = "USD",
		} = props
		this.name = String(name)
		this.provider = String(provider)
		this.context = ModelContext.from(context)
		this.features = ModelFeatures.from(features)
		this.prices = ModelPrices.from(prices)
		this.input = ModelFormat(input)
		this.output = ModelFormat(output)
		this.currency = currency
	}

	get maxInputBytes() {
		return (this.context.window - this.context.output) * 3
	}

	get maxBytes() {
		return this.context.window * 3
	}
	get empty() {
		return empty(this.provider) && empty(this.name)
	}
	is(name) {
		if (name instanceof Model) {
			return name === this
		}
		if ("function" === typeof name) {
			return name(this)
		}
		if (!typeOf(String)(name)) {
			throw new TypeError([
				"Provided value must be a string or an instance of Model",
				"Provided: " + (typeof name),
				JSON.stringify(name)
			].join("\n"))
		}
		const [, model] = this.name.split("/")
		if (name.includes("/")) {
			return this.name.toLowerCase() === name.toLowerCase()
		}
		return model.toLowerCase() === name.toLowerCase()
	}
	sanitizeModelFormat(formats = []) {
		return formats?.filter?.(a => ChatModel.FORMATS.includes(a)) ?? []
	}
	/**
	 * Returns a formatted string representation of the model
	 * @returns {string} Formatted model info
	 */
	toString() {
		const provider = this.provider ? ` @${this.provider}` : ""
		return `${this.name}${provider} ${this.prices}`
	}

	/**
	 * Calculates the cost for given token usage
	 * @param {Usage} usage Token usage data
	 * @returns {number} Calculated cost
	 */
	calc(usage) {
		const rate = 10 ** 6
		usage.cost = (
			this.prices.input * usage.prompt_tokens +
			(this.prices.cache > 0 ? this.prices.cache * usage.cached_tokens : 0) +
			this.prices.output * usage.completion_tokens
		) / rate
		return usage.cost
	}
	static from(props) {
		if (props instanceof ChatModel) return props
		return new this(props)
	}
}

export default ChatModel
