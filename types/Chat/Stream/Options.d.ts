export default StreamOptions;
declare class StreamOptions {
    static from(props: any): StreamOptions;
    /**
     * @param {object} props
     * @param {string} props.model
     * @param {Array<{role: string, content: string}>} props.messages
     * @param {boolean} props.stream
     * @param {number} props.temperature
     * @param {number} props.max_tokens
     * @param {number} props.top_p
     */
    constructor(props?: {
        model: string;
        messages: Array<{
            role: string;
            content: string;
        }>;
        stream: boolean;
        temperature: number;
        max_tokens: number;
        top_p: number;
    });
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
    /** @type {number} */
    max_tokens: number;
    /** @type {number} */
    top_p: number;
    #private;
}
