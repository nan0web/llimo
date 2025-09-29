class HuggingFaceProvider {
	/** @type {string} */
	name
	/** @type {string} */
	url
	/** @type {Model[]} */
	models
	constructor(props = {}) {
		const {
			name = "",
			url = "",
			models = []
		} = props
		this.name = name
		this.url = url
		this.models = models
	}
	find(name) {
		if ("function" === typeof name) {
			return name(this)
		}
		return this.models.find(m => m.is(name))
	}
}

export default HuggingFaceProvider
