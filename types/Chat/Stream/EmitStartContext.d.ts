export default StreamEmitStartContext;
declare class StreamEmitStartContext extends StreamEmitData {
    constructor(props?: {});
    /** @type {StreamOptions} */
    options: StreamOptions;
    /** @type {ChatMessage} */
    chat: ChatMessage;
    /** @type {Usage} */
    usage: Usage;
    getHash(len?: number): string;
    get uri(): string;
    add(context: any): void;
}
import StreamEmitData from "./EmitData.js";
import StreamOptions from "./Options.js";
import ChatMessage from "../Message.js";
import Usage from "../Usage.js";
