export default ChatChunk;
declare class ChatChunk {
    /**
     * Create ChatChunk from plain object or return if already instance.
     * @param {object|ChatChunk} props
     * @returns {ChatChunk}
     */
    static from(props?: object | ChatChunk): ChatChunk;
    /**
     * @param {object} [props]
     * @param {string} [props.id=""]
     * @param {string} [props.object=""]
     * @param {number} [props.created=0]
     * @param {string} [props.model=""]
     * @param {string} [props.service_tier=""]
     * @param {string} [props.finish_reason=""]
     * @param {string} [props.system_fingerprint=""]
     * @param {Array<object|ChatChoice>} [props.choices=[]]
     */
    constructor(props?: {
        id?: string | undefined;
        object?: string | undefined;
        created?: number | undefined;
        model?: string | undefined;
        service_tier?: string | undefined;
        finish_reason?: string | undefined;
        system_fingerprint?: string | undefined;
        choices?: any[] | undefined;
    } | undefined);
    /** @type {string} */
    id: string;
    /** @type {string} */
    object: string;
    /** @type {number} */
    created: number;
    /** @type {string} */
    model: string;
    /** @type {string} */
    finish_reason: string;
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
