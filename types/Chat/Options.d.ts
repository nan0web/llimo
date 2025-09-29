export default ChatOptions;
declare class ChatOptions {
    static DEFAULTS: {
        temperature: number;
        max_tokens: number;
        top_p: number;
    };
    constructor(props?: {});
    /** @type {number} */
    temperature: number;
    /** @type {number} */
    max_tokens: number;
    /** @type {number} */
    top_p: number;
    toString(): string;
}
