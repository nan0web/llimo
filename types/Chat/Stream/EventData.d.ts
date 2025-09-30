export default ChatEventData;
export type ChatEventDataProps = {
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
    chunks?: ChatChunk[] | undefined;
    answer?: ChatChunk[] | undefined;
    thoughts?: ChatChunk[] | undefined;
    thinking?: boolean | undefined;
    delta?: string | undefined;
    options?: any;
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
 * @typedef {Object} ChatEventDataProps
 * @property {string} [id] - Chat session ID
 * @property {number} [startedAt] - Timestamp when the chat started
 * @property {ChatChunk} [chunk] - The chunk data containing id and choices
 * @property {ChatChunk[]} [chunks=[]]
 * @property {ChatChunk[]} [answer=[]]
 * @property {ChatChunk[]} [thoughts=[]]
 * @property {boolean} [thinking=false]
 * @property {string} [delta=""]
 * @property {Object} [options={}]
 * @property {number} [created] - Timestamp when the chunk was created
 * @property {string} [model] - Model name used
 * @property {string} [object] - Type of the response object
 * @property {string} [service_tier] - Service tier (e.g., 'pro', 'free')
 * @property {string} [system_fingerprint] - System fingerprint
 */
/**
 * Represents data related to a single chat event.
 */
declare class ChatEventData {
    /**
     * Creates a ChatEventData instance from the given input.
     *
     * @param {ChatEventData | ChatEventDataProps} [props={}] - Existing instance or raw data.
     * @returns {ChatEventData}
     */
    static from(props?: ChatEventData | ChatEventDataProps | undefined): ChatEventData;
    /**
     * Constructs a new ChatEventData instance.
     *
     * @param {ChatEventDataProps} [props={}] - The data used to initialize the event.
     */
    constructor(props?: ChatEventDataProps | undefined);
    /** @type {string} */
    chatId: string;
    /** @type {number} */
    startedAt: number;
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
    /** @type {Object} */
    options: any;
    /** @type {string} */
    id: string;
    /** @type {ChatChoice[]} */
    choices: ChatChoice[];
    /** @type {number} */
    created: number;
    /** @type {string} */
    model: string;
    /** @type {string} */
    object: string;
    /** @type {string} */
    service_tier: string;
    /** @type {string} */
    system_fingerprint: string;
    delta: string;
}
import ChatChunk from "./Chunk.js";
import ChatChoice from "./Choice.js";
