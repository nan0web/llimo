import HuggingFaceModel from "./HuggingFaceModel.js"

class HuggingFaceProvider {
	/** @type {string} */
	name
	/** @type {string} */
	url
	/** @type {HuggingFaceModel[]} */
	models
	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { name: props }
		}
		const {
			name = "",
			url = "",
			models = []
		} = props
		this.name = name
		this.url = url
		this.models = models.map(m => new HuggingFaceModel(m))
	}
	find(name) {
		if ("function" === typeof name) {
			return name(this)
		}
		return this.models.find(m => m.is(name))
	}
	toString() {
		return this.name + " (" + this.models.map(m => m.name).join(", ")  +")"
	}
}

export default HuggingFaceProvider
