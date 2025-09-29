export default ChatDelta;
declare class ChatDelta {
    static from(props?: {}): ChatDelta;
    constructor(props?: {});
    /** @type {string} */
    content: string;
    /** @type {string|null} */
    refusal: string | null;
    /** @type {string|null} */
    role: string | null;
    toString(): string;
}
