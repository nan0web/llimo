export default class HuggingFaceDriver extends ChatDriver {
    static MODELS: {
        "deepseek-r1-qwen3-8b-v4-small": any;
    };
    static PROVIDERS: {
        cerebras: HuggingFaceProvider;
        cohere: HuggingFaceProvider;
        novita: HuggingFaceProvider;
    };
    static PROVIDERS_OR_POLICIES: readonly ["black-forest-labs", "cerebras", "cohere", "fal-ai", "featherless-ai", "fireworks-ai", "groq", "hf-inference", "hyperbolic", "nebius", "novita", "nscale", "openai", "ovhcloud", "publicai", "replicate", "sambanova", "scaleway", "together", "zai-org", "auto"];
    /**
     * Creates driver instance
     * @param {object} props
     * @param {object} [props.auth={}] Auth config.
     * @param {ChatModel} props.model Model
     * @param {DB} props.db Database
     * @param {Partial<HFDriverOptions>} props.options Default options
     */
    constructor(config?: {});
    /** @type {InferenceClient} */
    client: InferenceClient;
    /** @type {HFDriverOptions} */
    options: HFDriverOptions;
    get PROVIDERS(): {
        cerebras: HuggingFaceProvider;
        cohere: HuggingFaceProvider;
        novita: HuggingFaceProvider;
    };
    /**
     * @returns {HuggingFaceProvider}
     */
    get provider(): HuggingFaceProvider;
    /**
     * @param {Array<{ role: string, content: string }>} messages
     * @returns {HFStreamOptions}
     */
    getStreamOptions(messages: Array<{
        role: string;
        content: string;
    }>): HFStreamOptions;
    /**
     * @emits start {Object<...context, id, model, prompt, startedAt>}
     * @param {string|ChatMessage} prompt Input prompt
     * @param {string|ChatModel} model Model to use
     * @param {object} [context={}] Context for events
     * @returns
     */
    _complete(prompt: string | ChatMessage, model: string | ChatModel, context?: object): Promise<Response>;
    /**
     * @emits start {Object<...context, id, model, prompt, startedAt>}
     * @emits stream {Object<...context, id, model, prompt, startedAt, options>}
     * @emits data {Object<...context, id, model, prompt, startedAt, chunk, content>}
     * @emits end  {Object<...context, id, model, prompt, startedAt, spentMs, content>}
     * @param {*} prompt
     * @param {*} model
     * @param {*} context
     */
    chatCompletionStream(prompt: any, model: any, context?: any): AsyncGenerator<import(".pnpm/@huggingface+tasks@0.19.48/node_modules/@huggingface/tasks").ChatCompletionStreamOutput, void, unknown>;
    getModels(): Promise<import("./HuggingFaceModel.js").default[]>;
    getRealModel(model?: ChatModel): string;
    getTokens(content: any): Promise<number[]>;
    requireClient(): void;
    /**
     * @param {any} options
     * @returns {AsyncGenerator<any, any, any>}
     */
    createChatCompletionStream(options: any): AsyncGenerator<any, any, any>;
    emitStreamStart(log: any): void;
    emitStreamData(log: any): void;
    emitStreamEnd(log: any): void;
}
import ChatDriver from "../ChatDriver.js";
import { InferenceClient } from "@huggingface/inference";
import HFDriverOptions from "./Options.js";
import HuggingFaceProvider from "./HuggingFaceProvider.js";
import HFStreamOptions from "./Stream/Options.js";
import ChatMessage from "../../Message.js";
import ChatModel from "../../Model/Model.js";
import Response from "../../Response.js";
