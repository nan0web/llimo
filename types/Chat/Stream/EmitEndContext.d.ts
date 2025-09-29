export default StreamEmitEndContext;
declare class StreamEmitEndContext extends StreamEmitData {
    constructor(props?: {});
    /** @type {StreamOptions} */
    options: StreamOptions;
    /** @type {ChatChunk[]} */
    chunks: ChatChunk[];
    /** @type {ChatChunk[]} */
    answer: ChatChunk[];
    /** @type {ChatChunk[]} */
    thoughts: ChatChunk[];
    /** @type {Response} */
    response: Response;
}
import StreamEmitData from "./EmitData.js";
import StreamOptions from "./Options.js";
import Response from "../Response.js";
