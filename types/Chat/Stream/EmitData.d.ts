export default ChatEmitData;
export type ChatEmitDataProps = {
    /**
     * - Chat session ID
     */
    id?: string | undefined;
    /**
     * - Timestamp when the chat started
     */
    startedAt?: number | undefined;
    /**
     * - The chunk data containing id and choices
     */
    chunk?: ChatChunk | undefined;
    /**
     * - Timestamp when the chunk was created
     */
    created?: number | undefined;
    /**
     * - Model name used
     */
    model?: string | undefined;
    /**
     * - Type of the response object
     */
    object?: string | undefined;
    /**
     * - Service tier (e.g., 'pro', 'free')
     */
    service_tier?: string | undefined;
    /**
     * - System fingerprint
     */
    system_fingerprint?: string | undefined;
};
/**
 * @typedef {Object} ChatEmitDataProps
 * @property {string} [id] - Chat session ID
 * @property {number} [startedAt] - Timestamp when the chat started
 * @property {ChatChunk} [chunk] - The chunk data containing id and choices
 * @property {number} [created] - Timestamp when the chunk was created
 * @property {string} [model] - Model name used
 * @property {string} [object] - Type of the response object
 * @property {string} [service_tier] - Service tier (e.g., 'pro', 'free')
 * @property {string} [system_fingerprint] - System fingerprint
 */
/**
 * Represents data related to a single data emit during stream.
 */
declare class ChatEmitData {
    /**
     * Creates a ChatEmitData instance from the given input.
     *
     * @param {ChatEmitData | ChatEmitDataProps} [props={}] - Existing instance or raw data.
     * @returns {ChatEmitData}
     */
    static from(props?: ChatEmitData | ChatEmitDataProps | undefined): ChatEmitData;
    /**
     * Constructs a new ChatEmitData instance.
     *
     * @param {ChatEmitDataProps} [props={}] - The data used to initialize the event.
     */
    constructor(props?: ChatEmitDataProps | undefined);
    /** @type {string} */
    chatId: string;
    /** @type {number} */
    startedAt: number;
}
import ChatChunk from "./Chunk.js";
