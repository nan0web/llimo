export default OpenRouterDriver;
/**
 * Driver for OpenRouter API using official SDK with compatible interface
 * @example
 * ```js
 * const driver = new OpenRouterDriver({
 *   auth: { apiKey: process.env.OPENROUTER_API_KEY },
 *   model: "qwen/qwen2.5-7b-instruct"
 * })
 * ```
 */
declare class OpenRouterDriver extends ChatDriver {
    static DEFAULT_HEADERS: {};
    constructor(config?: {});
    /** @type {OpenAI} */
    api: OpenAI;
    /** @type {OpenRouterOptions} */
    options: OpenRouterOptions;
    /**
     * @emits start {Object<...context, id, model, prompt, startedAt>}
     * @param {string|ChatMessage} prompt - Input prompt
     * @param {string|ChatModel} model - Model to use
     * @param {object} [context={}] - Context for events
     * @returns {Promise<Response>}
     */
    _complete(prompt: string | ChatMessage, model: string | ChatModel, context?: object): Promise<Response>;
    /**
     * Prepare request for OpenRouter API
     * @param {string|ChatMessage} prompt
     * @param {ChatModel|string} model
     * @param {boolean} [stream=false] - Whether this is a streaming request
     * @returns {object}
     */
    prepareRequest(prompt: string | ChatMessage, model: ChatModel | string, stream?: boolean | undefined): object;
    getModels(): Promise<any[]>;
    /**
     * @param {StreamOptions} options
     * @returns {Promise<Stream<ChatCompletionChunk> | ChatCompletion>}
     */
    createChatCompletionStream(options: StreamOptions): Promise<Stream<ChatCompletionChunk> | ChatCompletion>;
}
declare namespace OpenRouterDriver {
    export { OpenRouterOptions as Options };
    export { Response };
}
import ChatDriver from "../ChatDriver.js";
import OpenAI from "openai";
import OpenRouterOptions from "./Options.js";
import ChatMessage from "../../index.js";
import { ChatModel } from "../../index.js";
import { Response } from "../../index.js";
import StreamOptions from "../../Stream/Options.js";
import { Stream } from "openai/core/streaming.js";
