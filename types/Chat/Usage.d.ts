export default ChatUsage;
/**
 * Represents token usage statistics
 */
declare class ChatUsage {
    static from(props: any): ChatUsage;
    /**
     * @param {object} input
     * @param {number} [input.prompt_tokens]
     * @param {number} [input.completion_tokens]
     * @param {number} [input.thoughts_tokens]
     * @param {number} [input.cached_tokens]
     * @param {number} [input.total_tokens]
     * @param {number} [input.cost]
     */
    constructor(input?: {
        prompt_tokens?: number | undefined;
        completion_tokens?: number | undefined;
        thoughts_tokens?: number | undefined;
        cached_tokens?: number | undefined;
        total_tokens?: number | undefined;
        cost?: number | undefined;
    });
    /** @type {Number} */
    prompt_tokens: number;
    /** @type {Number} */
    completion_tokens: number;
    /** @type {Number} */
    thoughts_tokens: number;
    /** @type {Number} */
    cached_tokens: number;
    /** @type {Number} */
    total_tokens: number;
    /** @type {Number} */
    cost: number;
    /**
     * Gets input tokens count
     * @returns {number} Input tokens
     */
    get tokensIn(): number;
    /**
     * Gets output tokens count
     * @returns {number} Output tokens
     */
    get tokensOut(): number;
    /**
     * Gets total tokens count
     * @returns {number} Total tokens
     */
    get total(): number;
    /**
     * Returns formatted usage string
     * @returns {string} Formatted usage info
     */
    toString(): string;
    toObject(): {
        prompt_tokens: number;
        completion_tokens: number;
        thoughts_tokens: number;
        cached_tokens: number;
        total_tokens: number;
        cost: number;
    };
}
