export default ChatChunk;
declare class ChatChunk {
    /**
     * Create ChatChunk from plain object or return if already instance.
     * @param {object|ChatChunk} props
     * @returns {ChatChunk}
     */
    static from(props?: object | ChatChunk): ChatChunk;
    /**
     * @param {object} props
     * @param {string} props.id
     * @param {string} props.object
     * @param {number} props.created
     * @param {string} props.model
     * @param {string} props.service_tier
     * @param {string} props.system_fingerprint
     * @param {Array<object|ChatChoice>} props.choices
     */
    constructor(props?: {
        id: string;
        object: string;
        created: number;
        model: string;
        service_tier: string;
        system_fingerprint: string;
        choices: Array<object | ChatChoice>;
    });
    /** @type {string} */
    id: string;
    /** @type {string} */
    object: string;
    /** @type {number} */
    created: number;
    /** @type {string} */
    model: string;
    /** @type {string} */
    service_tier: string;
    /** @type {string} */
    system_fingerprint: string;
    /** @type {ChatChoice[]} */
    choices: ChatChoice[];
    /** @type {number} */
    count: number;
    toString(): string | import("./Delta.js").default;
}
import ChatChoice from './Choice.js';
