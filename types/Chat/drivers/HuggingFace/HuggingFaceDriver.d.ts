export default HuggingFaceDriver;
declare class HuggingFaceDriver extends ChatDriver {
    static MODELS: {
        "deepseek-r1-qwen3-8b-v4-small": any;
    };
    static PROVIDERS: {
        novita: HuggingFaceProvider;
    };
    static PROVIDERS_OR_POLICIES: any;
    constructor(config?: {});
    /** @type {InferenceClient} */
    client: InferenceClient;
    /** @type {HFDriverOptions} */
    options: HFDriverOptions;
    /**
     * @returns {HuggingFaceProvider}
     */
    get provider(): HuggingFaceProvider;
    /**
     * @emits start {Object<...context, id, model, prompt, startedAt>}
     * @param {string|Prompt} prompt Input prompt
     * @param {string|Model} model Model to use
     * @param {object} [context={}] Context for events
     * @returns
     */
    _complete(prompt: string | Prompt, model: string | Model, context?: object): Promise<any>;
    /**
     * @emits start {Object<...context, id, model, prompt, startedAt>}
     * @emits stream {Object<...context, id, model, prompt, startedAt, options>}
     * @emits data {Object<...context, id, model, prompt, startedAt, chunk, content>}
     * @emits end  {Object<...context, id, model, prompt, startedAt, spentMs, content>}
     * @param {*} prompt
     * @param {*} model
     * @param {*} context
     */
    chatCompletionStream(prompt: any, model: any, context?: any): AsyncGenerator<any, void, unknown>;
    getModels(): Model[];
    getRealModel(model?: import("../../Model.js").default): string | false;
    getTokens(content: any): Promise<any>;
    requireClient(): void;
    /**
     * Gets model by name and context.options.provider
     * @param {string|Model} model - Model name
     * @returns {Model|null} - Model instance
     */
    getModel(model: string | Model): Model | null;
    /**
     * Stream function following OpenAIDriver algorithm
     * @param {ChatMessage} chat
     * @param {Model} model
     * @param {Function} onData callback for each delta chunk
     * @returns {Response}
     */
    stream(chat: ChatMessage, model: Model, onData?: Function): Response;
    emitStreamStart(log: any): void;
    emitStreamData(log: any): void;
    emitStreamEnd(log: any): void;
}
import ChatDriver from "../ChatDriver.js";
import HFDriverOptions from "./Options.js";
import HuggingFaceProvider from "./HuggingFaceProvider.js";
import { ChatMessage } from "../../index.js";
import { Response } from "../../index.js";
