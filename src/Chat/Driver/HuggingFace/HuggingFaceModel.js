import Model from "../../Model/Model.js"

class HuggingFaceModel extends Model {
	/** @type {string} */
	status
	/** @type {Record<string, boolean>} */
	features
	/** @type {Record<string, number>} */
	performance
	/** @type {Record<string, string | number | boolean>} */
	author
	/** @type {string} */
	validatedAt
	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { name: props }
		}
		super(props)
		const {
			status = "",
			features = {},
			performance = {},
			author = {},
			validatedAt = (new Date()).toISOString()
		} = props
		this.status = status
		this.features = features
		this.performance = performance
		this.author = author
		this.validatedAt = validatedAt
	}
	static from(props) {
		if (props instanceof HuggingFaceModel) return props
		return new this(props)
	}
}

export default HuggingFaceModel
