export default OpenRouterDriver;
declare class OpenRouterDriver extends ChatDriver {
    /**
     * Custom fetch method for OpenRouter endpoints
     * @param {string} uri
     * @param {RequestInit} [options={}]
     * @returns {Promise<any>}
     */
    myFetch(uri: string, options?: RequestInit | undefined): Promise<any>;
    /**
     * Fetch rate limit and credits information for the API key
     * @returns {Promise<{data: {label: string, usage: number, limit: number|null, is_free_tier: boolean}}>}
     */
    checkKey(): Promise<{
        data: {
            label: string;
            usage: number;
            limit: number | null;
            is_free_tier: boolean;
        };
    }>;
    /**
     * Fetch sorted list of available providers
     * @returns {Promise<Array<{name: string, id: string}>>}
     */
    getProviders(): Promise<Array<{
        name: string;
        id: string;
    }>>;
    /**
     * Fetch credits usage information
     * @returns {Promise<{total_credits: number, total_usage: number}>}
     */
    getCredits(): Promise<{
        total_credits: number;
        total_usage: number;
    }>;
    /**
     * Create a streaming chat completion with provider support
     * @param {StreamOptions} options
     * @returns {AsyncIterable<ChatChunk>}
     */
    createChatCompletionStream(options: StreamOptions): AsyncIterable<ChatChunk>;
    /**
     * Stream function following OpenAIDriver algorithm
     * @param {import("../Message.js")} chat
     * @param {import("../Model.js")} model
     * @param {Function} onData callback for each delta chunk
     * @returns {Promise<Response>}
     */
    stream(chat: typeof import("../Message.js"), model: typeof import("../Model.js"), onData?: Function): Promise<Response>;
}
import ChatDriver from "./ChatDriver.js";
import StreamOptions from "../Stream/Options.js";
import ChatChunk from "../Stream/Chunk.js";
import Response from "../Response.js";
