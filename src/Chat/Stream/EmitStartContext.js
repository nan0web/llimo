import StreamOptions from "./Options.js"
import StreamEmitData from "./EmitData.js"
import ChatMessage from "../Message.js"
import Usage from "../Usage.js"

class StreamEmitStartContext extends StreamEmitData {
	/** @type {StreamOptions} */
	options
	/** @type {ChatMessage} */
	chat
	/** @type {Usage} */
	usage
	constructor(props = {}) {
		super(props)
		const {
			options = new StreamOptions(),
			chat,
			usage,
		} = props
		this.options = options
		this.chat = chat
		this.usage = usage
	}
	getHash(len = 6) {
		const body = [
			this.options.max_tokens,
			this.options.temperature,
			this.options.top_p,
			this.options.messages.map(m => String(`${m.role}:\n${m.content}`).replace(/\s+/g, ""))
		].join("")
		const result = ""
		for (let i = 0; i < len; i++) {
			const step = Math.floor(body.length / len)
			const index = i * step + i % len
			const chars = Number(body.charCodeAt(index)).toString(36)
			const char = chars[i % chars.length]
			result += char
		}
		return result
	}
	get uri() {
		const time = new Date()
		const [d, t] = time.toISOString().split('T')
		return [
			d.replaceAll("-", "/"),
			this.options.model,
			t.slice(0, 2),
			t.slice(0, 8).replaceAll(":", "") + "-" + this.getHash()
		].join("/")
	}
	add(context) {
		this.dataContext.push(context)
	}
}

export default StreamEmitStartContext
