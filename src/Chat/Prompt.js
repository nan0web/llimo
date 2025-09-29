import { ContainerObject } from "@nan0web/types"

/**
 * Represents a chat prompt with role and content
 * @property {string} role
 * @property {string} content
 */
class Prompt extends ContainerObject {
	static ROLES = {
		user: "user",
		assistant: "assistant",
		system: "system"
	}
	/**
	 * @type {string}
	 */
	role
	/**
	 * @type {string}
	 */
	content

	constructor(props = {}) {
		if ("string" === typeof props) {
			props = { content: props }
		}
		super(props)
		const {
			role = Prompt.ROLES.user,
			content = "",
		} = props
		this.role = Prompt.ROLES[role] ?? role
		this.content = String(content)
	}

	/**
	 * Creates prompt from various input types
	 * @param {object|string|array} props Prompt data
	 * @returns {Prompt} Prompt instance
	 */
	static from(props) {
		if ("string" === typeof props) {
			return new this({ content: props.trim() })
		}
		if (Array.isArray(props)) {
			const [first, ...rest] = props
			return new this({
				role: first?.role || Prompt.ROLES.user,
				content: first?.content || String(first) || '',
				children: rest.map(p => Prompt.from(p))
			})
		}
		if (props instanceof Prompt) return props
		return new this(props)
	}

	toString() {
		return [
			`${this.role}: ${this.content}`,
			...this.flat().slice(1).map(p => String(p))
		].join("\n\n")
	}
}

export default Prompt
