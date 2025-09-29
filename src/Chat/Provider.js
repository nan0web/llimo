import { empty } from "@nan0web/types"
import ChatDriver from "./drivers/index.js"
import DB from "@nan0web/db"

class ChatProvider {
	/** @type {string} */
	name
	/** @type {string} */
	slug
	/** @type {string} */
	privacy_policy_url
	/** @type {string} */
	terms_of_service_url
	/** @type {string} */
	status_page_url
	/** @type {boolean} */
	may_log_prompts
	/** @type {boolean} */
	may_train_on_data
	/** @type {boolean} */
	moderated_by_openrouter
	/** @type {ChatDriver} */
	driver
	/** @type {object} */
	auth
	/** @type {object} */
	options

	/**
	 * @param {object} props
	 * @param {string} props.name
	 * @param {string} props.slug
	 * @param {string} props.privacy_policy_url
	 * @param {string} props.terms_of_service_url
	 * @param {string} props.status_page_url
	 * @param {boolean} props.may_log_prompts
	 * @param {boolean} props.may_train_on_data
	 * @param {boolean} props.moderated_by_openrouter
	 * @param {ChatDriver|string|null|undefined} props.driver
	 * @param {object} props.auth
	 * @param {DB} props.db
	 * @param {object} props.options
	 */
	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { name: props }
		}
		if ("string" === typeof props.driver) {
			const Driver = ChatDriver.getDriver(props.driver)
			if (Driver) {
				props.driver = new Driver({ ...props })
			} else {
				props.driver = null
			}
		}
		const {
			name = "",
			slug = "",
			privacy_policy_url = "",
			terms_of_service_url = "",
			status_page_url = "",
			may_log_prompts = false,
			may_train_on_data = false,
			moderated_by_openrouter = false,
			driver = undefined,
			auth = {},
			db,
			options = {},
		} = props
		this.name = String(name)
		this.slug = String(slug)
		this.privacy_policy_url = String(privacy_policy_url)
		this.terms_of_service_url = String(terms_of_service_url)
		this.status_page_url = String(status_page_url)
		this.may_log_prompts = Boolean(may_log_prompts)
		this.may_train_on_data = Boolean(may_train_on_data)
		this.moderated_by_openrouter = Boolean(moderated_by_openrouter)
		this.driver = driver
		this.auth = auth
		this.db = db
		this.options = options
	}

	get empty() {
		return empty(this.name) && empty(this.driver) && empty(this.db)
	}

	toString() {
		const arr = [this.name, "/" + this.slug]
		if (this.may_log_prompts) arr.push("#may_log")
		if (this.moderated_by_openrouter) arr.push("#moderated")
		const info = arr.join(" ")
		const urls = [
			this.privacy_policy_url ? `Policy: ${this.privacy_policy_url}` : "",
			this.terms_of_service_url ? `Terms: ${this.terms_of_service_url}` : "",
			this.status_page_url ? `Status: ${this.status_page_url}` : "",
		].filter(Boolean).join("\n")
		return [info, urls].filter(Boolean).join("\n")
	}

	async init() {
		await this.driver.init()
	}

	static from(props = {}) {
		if (props instanceof ChatProvider) return props
		return new this(props)
	}
}

export default ChatProvider
