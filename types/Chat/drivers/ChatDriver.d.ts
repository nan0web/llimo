export default ChatDriver;
/**
 * Base class for chat drivers
 */
declare class ChatDriver extends NanoEvent {
    static MODELS: {};
    static PROVIDERS: {};
    static DRIVERS: {};
    static DEFAULT_MODEL: string;
    static DEFAULT_ENDPOINT: string;
    static DEFAULT_MAX_TOKENS: number;
    static LOG_STREAM_INTERVAL: number;
    static IGNORE_AUTH: boolean;
    static Prompt: typeof ChatMessage;
    static Response: typeof Response;
    static DB: typeof DB;
    /**
     * Generates unique ID for requests
     * @returns {string} Unique ID
     */
    static uniqueID(): string;
    /**
     * Finds driver for model
     * @param {string} model - Model name
     * @param {string} driver - Config options, might have {driver}.
     * @returns {typeof ChatDriver|null} Driver class
     */
    static findDriver(model: string, driver: string): typeof ChatDriver | null;
    /**
     * @param {string} name - The driver name
     * @returns {typeof ChatDriver|null} - ChatDriver class on success, null on
     */
    static getDriver(name: string): typeof ChatDriver | null;
    /**
     * Creates driver instance
     * @param {object} props
     * @param {object} [props.auth={}] Auth config.
     * @param {Model} props.model Model
     * @param {DB} props.db Database
     * @param {string} props.name Name
     * @param {object} props.options Default options
     */
    constructor(props?: {
        auth?: object;
        model: Model;
        db: DB;
        name: string;
        options: object;
    });
    /**
     * @type {object}
     * @deprecated
     */
    config: object;
    /** @type {object} */
    auth: object;
    /** @type {Model} */
    model: Model;
    /** @type {DB} */
    db: DB;
    /** @type {DriverOptions} */
    options: DriverOptions;
    /**
     * @returns {typeof ChatDriver}
     */
    get __(): typeof ChatDriver;
    toPublic(): any;
    requireModel(): void;
    /**
         * @todo write tests to be sure the events are triggered only once, without duplicates.
         */
    requireEvents(prefix?: string): void;
    /**
     * Initializes the driver
     * @returns {Promise<void>}
     */
    init(): Promise<void>;
    readValueOrFile(value: any, file: any): Promise<any>;
    /**
     * Wrapper for fetch requests
     * @param {string} url Request URL
     * @param {object} req Request options
     * @returns {Promise<NodeResponse>} Fetch response
     */
    fetch(url: string, req: object): Promise<NodeResponse>;
    /**
     * Gets model by name
     * @param {string|Model} model - Model name
     * @returns {Model|null} - Model instance
     */
    getModel(model: string | Model): Model | null;
    /**
     * @returns {Model[]}
     */
    getModels(): Model[];
    getRealModel(): string;
    /**
     * @param {StreamLog} log
     */
    emitStreamStart(log: StreamLog): void;
    /**
     * @param {StreamLog} log
     */
    emitStreamData(log: StreamLog): void;
    /**
     * @param {StreamLog} log
     */
    emitStreamEnd(log: StreamLog): void;
    /**
     * Completes prompt using LLM model
     * @param {string|ChatMessage} prompt Input prompt
     * @param {string|Model} model Model to use
     * @param {object} [context={}] Context for events
     * @returns {Promise<Response>} Response
     */
    complete(prompt: string | ChatMessage, model: string | Model, context?: object): Promise<Response>;
    /**
     * @param {ChatMessage} chat
     * @param {Model} model
     * @param {Function} onData
     * @returns {Response}
     */
    stream(chat: ChatMessage, model: Model, onData?: Function): Response;
    /**
     * Gets authorization headers
     * @returns {object} Headers object
     */
    _authHeader(): object;
    /**
     * Decodes prompt to ChatMessage instance
     * @param {ChatMessage|object} prompt ChatMessage or function
     * @returns {ChatMessage} Message instance
     */
    _decodePrompt(prompt: ChatMessage | object): ChatMessage;
    /**
     * Gets request options for API
     * @param {ChatMessage|function} prompt ChatMessage or function
     * @returns {object} Request options
     */
    _request(prompt: ChatMessage | Function): object;
    /**
     * Gets chat completion endpoint URL
     * @returns {string} Endpoint URL
     */
    _chatCompletionEndpoint(): string;
    /**
     * @param {StreamOptions} options
     * @returns {Stream<ChatCompletionChunk> | ChatCompletion}
     */
    createChatCompletionStream(options: StreamOptions): Stream<ChatCompletionChunk> | ChatCompletion;
    /**
     * Prepares chat completion request
     * @param {ChatMessage|function} prompt ChatMessage or function
     * @returns {Promise<object>} Request options for fetch()
     */
    _chatCompletionRequest(prompt: ChatMessage | Function): Promise<object>;
    /**
     * Internal completion method
     * @param {string|ChatMessage} prompt Input prompt
     * @param {Model} model Model to use
     * @param {object} [context={}] Context for events
     * @returns {Promise<Response>} Response
     * @emits start {Object} Before starting request
     * @emits completeInterval {Object} During request (every 99ms)
     * @emits data {Object} On receiving data chunk
     * @emits end {Response} On completion
     * @emits error {Error} On error
     */
    _complete(prompt: string | ChatMessage, model: Model, context?: object): Promise<Response>;
    /**
     * Gets tokens for content
     * @param {string} content Input content
     * @returns {Promise<Array<number>>} Tokens
     */
    getTokens(content: string): Promise<Array<number>>;
    /**
     * Returns extra added tokens to remove from the max_tokens.
     * Gpt-tokenizer throws an error if special tags included.
     * @returns {Promise<array>} - The extra added tokens.
     */
    getAddedTokens(): Promise<any[]>;
    /**
     * Returns the max_tokens value.
     * @param {array|number} tokens The tokens array or its count.
     */
    getMaxTokensOption(tokens?: any[] | number): number;
    /**
     * Returns the count of tokens in the prompt(s).
     * @param {ChatMessage} prompt The prompt to weight.
     * @returns {Promise<number>} The count of tokens, returns negative count in case of guessing,
     *                            and positive if precise number is counted by LLM model.
     */
    getTokensCount(prompt: ChatMessage): Promise<number>;
    /**
     * Deep merges multiple objects. Only objects are merged, other types are skipped.
     * Priorty of merging: [0] <= [1] <= [2] <= [3], so [3] is the lowest in priority.
     * @param {...Object} sources - The source objects to merge from.
     * @returns {Object} The merged result
    */
    merge(...sources: any[]): any;
    prepareRequest(prompt: any, { max_tokens }?: {
        max_tokens?: null | undefined;
    }): Promise<any>;
    /**
     * Gets embeddings for text
     * @param {string|string[]} text Input text or array
     * @param {boolean} [averageVector=false] Return average vector
     * @returns {Promise<number[][]>} Embeddings
     */
    getEmbeddings(text: string | string[], averageVector?: boolean | undefined): Promise<number[][]>;
    /**
     * Calculates average vector
     * @param {Array<number[]>} vectors Input vectors
     * @returns {number[]} Average vector
     */
    average(vectors: Array<number[]>): number[];
    /**
     * Extracts files from response
     * @param {Response} response Response object
     * @returns {object} Files dictionary
     */
    extractFiles(response: Response): object;
    /**
     * Reads code blocks from text
     * @param {string} text Input text
     * @returns {object} Files dictionary
     */
    readCodeResponse(text: string): object;
    /**
     * Parses completion response
     * @param {object} res API response
     * @param {object} [context={}] Context object
     * @returns {Promise<object>} Parsed data
     */
    _parseChatCompletionResponse(res: object, context?: object): Promise<object>;
    /**
     * Parses completion text
     * @param {string} text Response text
     * @param {object} [context={}] Context object
     * @returns {object|null} Parsed data
     */
    _parseChatCompletionResponseText(text: string, context?: object): object | null;
}
import NanoEvent from "@yaro.page/nano-events";
import Model from "../Model.js";
import DB from "@nan0web/db";
import DriverOptions from "./Options.js";
import StreamLog from "../Stream/Log.js";
import ChatMessage from "../Message.js";
import Response from "../Response.js";
import StreamOptions from "../Stream/Options.js";
