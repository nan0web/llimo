export default ChatChoice;
declare class ChatChoice {
    /**
     * Create ChatChoice from plain object or return if already instance.
     *
     * @param {object} props - Properties of the chat choice.
     * @param {object|ChatDelta} props.delta - Partial message content.
     * @param {string|null} props.finish_reason - Reason for completion.
     * @param {number} props.index - Index of the choice.
     * @param {string|null} [props.logprobs] - Optional logprobs information.
     * @returns {ChatChoice}
     */
    static from(props: {
        delta: object | ChatDelta;
        finish_reason: string | null;
        index: number;
        logprobs?: string | null | undefined;
    }): ChatChoice;
    constructor(props?: {});
    /** @type {ChatDelta} */
    delta: ChatDelta;
    /** @type {string|null} */
    finish_reason: string | null;
    /** @type {number} */
    index: number;
    /** @type {string|null} */
    logprobs: string | null;
}
import ChatDelta from "./Delta.js";
