import ChatChunk from "./Chunk.js"
import StreamEmitData from "./EmitData.js"
import StreamOptions from "./Options.js"

class StreamEmitDataContext extends StreamEmitData {
	/** @type {StreamOptions} */
	options
	/** @type {ChatChunk} */
	chunk
	/** @type {ChatChunk[]} */
	chunks
	/** @type {ChatChunk[]} */
	answer
	/** @type {ChatChunk[]} */
	thoughts
	/** @type {boolean} */
	thinking
	/** @type {string} */
	delta

	/**
	 * @param {object} props
	 * @param {StreamOptions} [props.options]
	 * @param {ChatChunk} [props.chunk]
	 * @param {ChatChunk[]} [props.chunks]
	 * @param {ChatChunk[]} [props.answer]
	 * @param {ChatChunk[]} [props.thoughts]
	 * @param {boolean} [props.thinking]
	 * @param {string} [props.delta]
	 */
	constructor(props = {}) {
		super(props)
		const {
			options = new StreamOptions(),
			chunk = {},
			chunks = [],
			answer = [],
			thoughts = [],
			thinking = false,
			delta = "",
		} = props
		this.options = options
		this.chunk = ChatChunk.from(chunk)
		this.chunks = chunks
		this.answer = answer
		this.thoughts = thoughts
		this.thinking = Boolean(thinking)
		this.delta = String(delta)
	}
}

export default StreamEmitDataContext
