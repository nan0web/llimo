import DriverOptions from "../Options.js"

class HFDriverOptions extends DriverOptions {
	/** @type {string} */
	provider
	constructor(props = {}) {
		super(props)
		const {
			provider
		} = props
		this.provider = provider
	}
	static from(props) {
		if (props instanceof HFDriverOptions) return props
		return new this(props)
	}
}

export default HFDriverOptions
