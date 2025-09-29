import { to } from "@nan0web/types"
import StreamEmitStartContext from "./EmitStartContext.js"
import StreamEmitEndContext from "./EmitEndContext.js"
import StreamEmitDataContext from "./EmitDataContext.js"

class StreamLog {
	/** @type {StreamEmitStartContext} */
	start
	/** @type {StreamEmitDataContext[]} */
	data
	/** @type {StreamEmitEndContext} */
	end
	/** @type {string} */
	uri
	constructor(props = {}) {
		const {
			start = new StreamEmitStartContext(),
			data = [],
			end = new StreamEmitEndContext(),
			uri,
		} = props
		this.start = start
		this.data = data
		this.end = end
		this.uri = uri ?? this.getUri()
	}
	getHash(len = 6) {
		if (!this.start) {
			throw new Error("Requires a start context to wrap a hash")
		}
		const body = [
			this.start.options.max_tokens,
			this.start.options.temperature,
			this.start.options.top_p,
			this.start.options.messages.map(m => String(`${m.role}:\n${m.content}`).replace(/\s+/g, ""))
		].join("")
		let result = ""
		for (let i = 0; i < len; i++) {
			const step = Math.floor(body.length / len)
			const index = i * step + i % len
			const chars = Number(body.charCodeAt(index)).toString(36)
			const char = chars[i % chars.length]
			result += char
		}
		return result
	}
	getUri() {
		const time = new Date()
		const [d, t] = time.toISOString().split('T')
		return [
			d.replaceAll("-", "/"),
			this.start.options.model,
			t.slice(0, 2),
			t.slice(0, 8).replaceAll(":", "") + "-" + this.getHash()
		].join("/")
	}
	add(context) {
		this.data.push(context)
	}
	toObject() {
		return {
			start: to(Object)(this.start ?? {}),
			data: this.data.map(data => data.chunk),
			response: to(Object)(this.end?.response ?? {})
		}
	}
}

export default StreamLog
