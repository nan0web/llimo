export default StreamEmitDataContext;
declare class StreamEmitDataContext extends StreamEmitData {
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
    constructor(props?: {
        options?: StreamOptions | undefined;
        chunk?: ChatChunk | undefined;
        chunks?: ChatChunk[] | undefined;
        answer?: ChatChunk[] | undefined;
        thoughts?: ChatChunk[] | undefined;
        thinking?: boolean | undefined;
        delta?: string | undefined;
    });
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
