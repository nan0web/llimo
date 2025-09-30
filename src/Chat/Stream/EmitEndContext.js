import Response from "../Response.js"
import StreamEmitData from "./EmitData.js"
import StreamOptions from "./Options.js"
import ChatChunk from "./Chunk.js"

class StreamEmitEndContext extends StreamEmitData {
	/** @type {StreamOptions} */
	options
	/** @type {ChatChunk[]} */
	chunks
	/** @type {ChatChunk[]} */
	answer
	/** @type {ChatChunk[]} */
	thoughts
	/** @type {Response} */
	response
	constructor(props = {}) {
		super(props)
		const {
			options = new StreamOptions(),
			chunks = [],
			answer = [],
			thoughts = [],
			response,
		} = props
		this.options = options
		this.chunks = chunks
		this.answer = answer
		this.thoughts = thoughts
		this.response = response
	}
}

export default StreamEmitEndContext
