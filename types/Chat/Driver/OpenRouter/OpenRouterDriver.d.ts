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
    /**
     * @param {object} config
     * @param {OpenAI} config.api
     * @param {Partial<OpenRouterOptions>} [config.options]
     * @param {Object} [config.auth]
     * @param {DB} config.db
     * @param {ChatModel} config.model
     */
    constructor(config: {
        api: OpenAI;
        options?: Partial<OpenRouterOptions> | undefined;
        auth?: any;
        db: DB;
        model: ChatModel;
    });
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
     * @param {any} options
     * @returns {AsyncGenerator<any, any, any>}
     */
    createChatCompletionStream(options: any): AsyncGenerator<any, any, any>;
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
import DB from "@nan0web/db";
