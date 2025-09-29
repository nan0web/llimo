import ChatProvider from "../Provider.js"

class OpenRouterProvider extends ChatProvider {
	/** @type {boolean} */
	may_log_prompts
	/** @type {boolean} */
	may_train_on_data
	/** @type {boolean} */
	moderated_by_openrouter
	/** @type {string} */
	privacy_policy_url
	/** @type {string} */
	terms_of_service_url
	/** @type {string} */
	status_page_url

	/**
	 * @param {object} props
	 * @param {string} props.name
	 * @param {string} props.slug
	 * @param {boolean} props.may_log_prompts
	 * @param {boolean} props.may_train_on_data
	 * @param {boolean} props.moderated_by_openrouter
	 * @param {string} props.privacy_policy_url
	 * @param {string} props.terms_of_service_url
	 * @param {string} props.status_page_url
	 */
	constructor(props = {}) {
		super(props)
		const {
			may_log_prompts = false,
			may_train_on_data = false,
			moderated_by_openrouter = false,
			privacy_policy_url = "",
			terms_of_service_url = "",
			status_page_url = "",
		} = props

		this.may_log_prompts = Boolean(may_log_prompts)
		this.may_train_on_data = Boolean(may_train_on_data)
		this.moderated_by_openrouter = Boolean(moderated_by_openrouter)
		this.privacy_policy_url = String(privacy_policy_url)
		this.terms_of_service_url = String(terms_of_service_url)
		this.status_page_url = String(status_page_url)
	}

	toString() {
		const arr = [this.name, "/" + this.slug]
		if (this.may_log_prompts) arr.push("#may_log")
		if (this.moderated_by_openrouter) arr.push("#moderated")
		return arr.join(" ") + "\n" +
			`Policy: ${this.privacy_policy_url}\n` +
			`Terms: ${this.terms_of_service_url}\n` +
			`Status: ${this.status_page_url}`
	}

	static from(props = {}) {
		if (props instanceof OpenRouterProvider) return props
		return new this(props)
	}
}

export default OpenRouterProvider
