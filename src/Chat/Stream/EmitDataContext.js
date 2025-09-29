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
	 * @type {StreamOptions} options
	 * @type {ChatChunk} chunk
	 * @type {ChatChunk[]} chunks
	 * @type {ChatChunk[]} answer
	 * @type {ChatChunk[]} thoughts
	 * @type {boolean} thinking
	 * @type {string} delta
	 */
	constructor(props = {}) {
		super(props)
		const {
			options = new StreamOptions(),
			chunk,
			chunks = [],
			answer = [],
			thoughts = [],
			thinking,
			delta,
		} = props
		this.options = options
		this.chunk = chunk
		this.chunks = chunks
		this.answer = answer
		this.thoughts = thoughts
		this.thinking = thinking
		this.delta = delta
	}
}

export default StreamEmitDataContext
