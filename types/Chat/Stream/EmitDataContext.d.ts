export default StreamEmitDataContext;
declare class StreamEmitDataContext extends StreamEmitData {
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
    constructor(props?: object);
    /** @type {StreamOptions} */
    options: StreamOptions;
    /** @type {ChatChunk} */
    chunk: ChatChunk;
    /** @type {ChatChunk[]} */
    chunks: ChatChunk[];
    /** @type {ChatChunk[]} */
    answer: ChatChunk[];
    /** @type {ChatChunk[]} */
    thoughts: ChatChunk[];
    /** @type {boolean} */
    thinking: boolean;
    /** @type {string} */
    delta: string;
}
import StreamEmitData from "./EmitData.js";
import StreamOptions from "./Options.js";
import ChatChunk from "./Chunk.js";
