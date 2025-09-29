export default StreamLog;
declare class StreamLog {
    constructor(props?: {});
    /** @type {StreamEmitStartContext} */
    start: StreamEmitStartContext;
    /** @type {StreamEmitDataContext[]} */
    data: StreamEmitDataContext[];
    /** @type {StreamEmitEndContext} */
    end: StreamEmitEndContext;
    /** @type {string} */
    uri: string;
    getHash(len?: number): string;
    getUri(): string;
    add(context: any): void;
    toObject(): {
        start: any;
        data: import("./Chunk.js").default[];
        response: any;
    };
}
import StreamEmitStartContext from "./EmitStartContext.js";
import StreamEmitDataContext from "./EmitDataContext.js";
import StreamEmitEndContext from "./EmitEndContext.js";
