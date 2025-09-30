export default StreamOptions;
declare class StreamOptions {
    static from(props: any): StreamOptions;
    /**
     * @param {Object} [input]
     * @param {string} [input.model=""]
     * @param {Array<{role: string, content: string}>} [input.messages]
     * @param {boolean} [input.stream]
     * @param {number} [input.temperature]
     * @param {number} [input.max_tokens]
     * @param {number} [input.top_p]
     */
    constructor(input?: {
        model?: string | undefined;
        messages?: {
            role: string;
            content: string;
        }[] | undefined;
        stream?: boolean | undefined;
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        top_p?: number | undefined;
    } | undefined);
    /** @type {string} */
    model: string;
    /** @type {Array<{role: string, content: string}>} */
    messages: Array<{
        role: string;
        content: string;
    }>;
    /** @type {boolean} */
    stream: boolean;
    /** @type {number | undefined} */
    temperature: number | undefined;
    /** @type {number | undefined} */
    max_tokens: number | undefined;
    /** @type {number | undefined} */
    top_p: number | undefined;
    #private;
}
