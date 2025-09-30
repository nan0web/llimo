import { ContainerObject, equal } from "@nan0web/types"
import stringWidth from "string-width"

/**
 * @todo convert to simple class (get rid of NanoElement)
 * @extends {ContainerObject}
 * @property {string} username
 */
class ChatMessage extends ContainerObject {
	static PROMPT_END_WORD = "\n#."
	static ROLES = {
		user: "user",
		assistant: "assistant",
		system: "system",
		os: "os",
	}
	static SHORT_ROLES_ALIASES = {
		"user": "usr"
	}
	static LOG_ROLES_KEYWORDS = {
		assistant: "# assistant:",
		system: "# system:",
		user: "# user:",
		os: "# os:",
	}
	/**
	 * @type {string}
	 */
	role
	/**
	 * @type {string}
	 */
	content
	/**
	 * @type {string}
	 */
	username
	/** @type {number} */
	count

	constructor(props = {}) {
		super(props)
		if ("string" === typeof props) {
			props = { content: props }
		}
		const {
			role = ChatMessage.ROLES.user,
			content = "",
			count = 0,
			username = "",
		} = props
		this.role = ChatMessage.ROLES[role] ?? role
		this.content = String(content)
		this.count = Number(count)
		this.username = String(username)
	}

	get size() {
		const flat = this.flat()
		return flat.reduce(
			(acc, element) => acc + element.content.length, 0
		)
	}

	/**
	 * @returns {ChatMessage}
	 */
	get recent() {
		const flat = this.flat()
		return flat.length ? flat[flat.length - 1] : this
	}

	get empty() {
		return "" === this.content && !this.children.length
	}

	get ended() {
		return this.content.endsWith(ChatMessage.PROMPT_END_WORD)
	}

	get messagesCount() {
		return this.flat().length
	}

	get systemMessages() {
		return this.flat().filter(m => m.role === ChatMessage.ROLES.system)
	}

	/**
	 * Adds a nested message to the current instance.
	 * @param {ChatMessage} message - The element to add (can be an object or string).
	 * @returns {ChatMessage}
	 */
	add(message) {
		if (equal(message.role, this.role, message.content, this.content, message.username, this.username)) {
			return this
		}
		message.level = this.level + 1
		super.add(message)
		// this.size += message.size
		this.count += Number(message.count)
		return this.recent
	}

	sumCount() {
		const arr = this.flat()
		this.count = arr.reduce((acc, msg) => (acc + msg.count), 0)
	}

	/**
	 * @param {object} [props={}]
	 * @param {boolean|string} [props.format=false] - true or "short" for aligned output.
	 * @param {boolean} [props.avoidTags=false]
	 * @param {number} [props.level=0]
	 * @param {string} [props.tab=""]
	 * @param {number[]} [props.columns] - Custom column widths: [role, username, content]
	 * @param {number} [props.padding=1] - Spacing between columns
	 * @returns {string}
	 */
	toString({
		format = false,
		avoidTags = false,
		level = 0,
		tab = "",
		columns,
		padding = 1
	} = {}) {
		if (equal(format, false, avoidTags, false, level, 0, tab, "", columns, undefined, padding, 1)) {
			return this.toLog()
		}
		const short = format === "short"
		const formatted = !!format

		const self = /** @type {typeof ChatMessage} */ (this.constructor)
		const flat = this.flat()

		let roleWidth = short ? 3 : 9
		let userWidth = 0
		let contentWidth = 0

		if (formatted && !columns) {
			for (const element of flat) {
				let role = short ? (self.SHORT_ROLES_ALIASES?.[element.role] ?? element.role.slice(0, 3)) : element.role
				let user = element.username ?? ""
				let content = element.content ?? ""
				roleWidth = Math.max(roleWidth, stringWidth(role))
				userWidth = Math.max(userWidth, stringWidth(user))
				contentWidth = Math.max(contentWidth, stringWidth(content))
			}
		} else if (Array.isArray(columns)) {
			[roleWidth, userWidth, contentWidth] = columns
		}

		const pad = (s, w) => s.padEnd(w)
		const lines = flat.map((element) => {
			let role = short ? (self.SHORT_ROLES_ALIASES?.[element.role] ?? element.role.slice(0, 3)) : element.role
			let user = element.username ?? ""
			let content = element.content ?? ""

			if (!formatted) {
				let label = element.role + (element.username ? ` @${element.username}` : "")
				return `${label}:\n${content}`
			}

			let prefix = [pad(role, roleWidth)]
			if (user) prefix.push("@" + pad(user, userWidth))
			let pre = prefix.join(" ")
			const label = pad(pre, roleWidth + userWidth) // Remove the extra space before colon
			const fullLabel = label + ":" // Add colon without padding

			const wrapped = content.match(new RegExp(`.{1,${contentWidth}}`, "g")) || []
			return wrapped.map((line, i) => i === 0 ? fullLabel + line : " ".repeat(fullLabel.length) + line).join("\n")
		})

		return lines.join("\n\n")
	}

	/**
	 * @param {object} [props={}]
	 * @returns {ChatMessage}
	 */
	static from(props = {}) {
		if (props instanceof ChatMessage) return props
		if ("string" === typeof props) {
			return new this({ content: props.trim() })
		}
		if (Array.isArray(props)) {
			const [first, ...rest] = props
			const root = new this(first)
			rest.forEach(p => root.recent.add(p))
			return root
		}
		return new this(props)
	}

	toLog() {
		return this.flat().map(el => (
			`# ${el.role}:\n${el.content}`
		)).join("\n\n")
	}

	/**
	 * @param {string|object} log - The log.md to parse.
	 * @returns {ChatMessage}
	 */
	static fromLog(log) {
		if ("string" === typeof log) {
			log = log.split("\n")
		}
		/** @type {ChatMessage | undefined} */
		let root
		const trash = []
		let role, current
		const push = () => {
			if (current) {
				const msg = new ChatMessage({
					role,
					content: current.map(c => c.row).join("\n").trim()
				})
				if (root) {
					root.recent.add(msg)
				} else {
					root = msg
				}
			}
		}

		const keywords = Object.values(ChatMessage.LOG_ROLES_KEYWORDS)
		log.forEach((row, i) => {
			if (keywords.includes(row)) {
				if (Array.isArray(current)) {
					push()
				}
				role = row.split(" ")[1].split(":")[0]
				current = []
			}
			else if (role) {
				if (!current) current = []
				current.push({ row, i })
			}
			else {
				trash.push({ row, i })
			}
		})
		push()
		return root ?? new ChatMessage()
	}

	/**
	 * @param {ChatMessage} recent
	 * @returns {boolean}
	 */
	isRecent(recent) {
		return equal(this.recent.content, recent.content, this.recent.role, recent.role)
	}
	/**
	 * Flattens the tree into an array.
	 * @returns {ChatMessage[]}
	 */
	flat() {
		return super.flat().map(o => ChatMessage.from(o))
	}
}

export default ChatMessage
