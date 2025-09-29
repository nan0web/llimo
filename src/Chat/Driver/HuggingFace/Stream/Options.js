import StreamOptions from "../../../Stream/Options.js"

class HFStreamOptions extends StreamOptions {
	/** @type {string} */
	provider
	constructor(props = {}) {
		super(props)
		const {
			provider = ""
		} = props
		this.provider = provider
	}
}

export default HFStreamOptions
