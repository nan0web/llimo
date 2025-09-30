/**
 * Base class for chat drivers
 */
export default class ChatDriver {
    static MODELS: {};
    static PROVIDERS: {};
    static DRIVERS: {};
    static DEFAULT_MODEL: string;
    static DEFAULT_ENDPOINT: string;
    /** @type {Record<string, string>} */
    static DEFAULT_HEADERS: Record<string, string>;
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
     * @param {object} input
     * @returns {ChatDriver}
     */
    static from(input: object): ChatDriver;
    /**
     * Creates driver instance
     * @param {object} props
     * @param {object} [props.auth={}] Auth config.
     * @param {ChatModel} props.model Model
     * @param {DB} props.db Database
     * @param {Partial<DriverOptions>} props.options Default options
     */
    constructor(props: {
        auth?: object;
        model: ChatModel;
        db: DB;
        options: Partial<DriverOptions>;
    });
    /**
     * @type {object}
     * @deprecated
     */
    config: object;
    /** @type {object} */
    auth: object;
    /** @type {ChatModel} */
    model: ChatModel;
    /** @type {DB} */
    db: DB;
    /** @type {DriverOptions} */
    options: DriverOptions;
    bus: import("@nan0web/event/types").EventBus;
    on(event: any, fn: any): void;
    off(event: any, fn: any): void;
    emit(event: any, data: any): Promise<import("../../../node_modules/@nan0web/event/types/types/EventContext.js").default<any>>;
    /**
     * @returns {typeof Response}
     */
    get Response(): typeof Response;
    /**
     * @returns {string}
     */
    get DEFAULT_ENDPOINT(): string;
    /**
     * @returns {string}
     */
    get DEFAULT_MODEL(): string;
    /**
     * @returns {number}
     */
    get DEFAULT_MAX_TOKENS(): number;
    /**
     * @returns {Record<string, string>}
     */
    get DEFAULT_HEADERS(): Record<string, string>;
    /**
     * @returns {Record<string, object>}
     */
    get MODELS(): Record<string, any>;
    /**
     * @returns {number}
     */
    get LOG_STREAM_INTERVAL(): number;
    toPublic(): any;
    toString(): string;
    requireModel(): void;
    /**
         * @todo write tests to be sure the events are triggered only once, without duplicates.
         */
    requireEvents(prefix?: string, off?: boolean): void;
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
     * @returns {Promise<ResponseMessage>} Fetch response
     */
    fetch(url: string, req: object): Promise<ResponseMessage>;
    /**
     * Gets model by name
     * @param {string|ChatModel} model - Model name
     * @returns {Promise<ChatModel|null>} - Model instance
     */
    getModel(model: string | ChatModel): Promise<ChatModel | null>;
    /**
     * @returns {Promise<ChatModel[]>}
     */
    getModels(): Promise<ChatModel[]>;
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
     * @param {ChatChunk} chunk
     * @param {ChatChunk[]} chunks
     * @param {boolean} thinking
     * @returns {boolean}
     */
    isThinking(chunk: ChatChunk, chunks?: ChatChunk[], thinking?: boolean): boolean;
    /**
     * @param {ChatChunk} chunk
     * @returns {boolean} True on success, false on failre.
     */
    isThinkingToken(chunk: ChatChunk): boolean;
    /**
     * Completes prompt using LLM model
     * @param {string|ChatMessage} prompt Input prompt
     * @param {string|ChatModel} model Model to use
     * @param {object} [context={}] Context for events
     * @returns {Promise<Response | undefined>} Response
     */
    complete(prompt: string | ChatMessage, model: string | ChatModel, context?: object): Promise<Response | undefined>;
    /**
     * @param {Array<{ role: string, content: string }>} messages
     * @returns {StreamOptions}
     */
    getStreamOptions(messages: Array<{
        role: string;
        content: string;
    }>): StreamOptions;
    /**
     * @param {ChatMessage} chat
     * @param {ChatModel} model
     * @param {Function} onData
     * @returns {Promise<Response>}
     */
    stream(chat: ChatMessage, model: ChatModel, onData?: Function): Promise<Response>;
    /**
     * Gets authorization headers
     * @returns {object} Headers object
     */
    _authHeader(): object;
    /**
     * Decodes prompt to Prompt instance
     * @param {ChatMessage|function} prompt ChatMessage or function
     * @returns {ChatMessage} Message instance
     */
    _decodePrompt(prompt: Function | ChatMessage): ChatMessage;
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
     * @returns {AsyncGenerator<any, any, any>}
     */
    createChatCompletionStream(options: StreamOptions): AsyncGenerator<any, any, any>;
    /**
     * Prepares chat completion request
     * @param {ChatMessage|string} prompt ChatMessage or function
     * @returns {Promise<object>} Request options for fetch()
     */
    _chatCompletionRequest(prompt: ChatMessage | string): Promise<object>;
    /**
     * Internal completion method
     * @param {string|ChatMessage} prompt Input prompt
     * @param {ChatModel} model Model to use
     * @param {object} [context={}] Context for events
     * @returns {Promise<Response | undefined>} Response
     * @emits start {Object} Before starting request
     * @emits completeInterval {Object} During request (every 99ms)
     * @emits data {Object} On receiving data chunk
     * @emits end {Response} On completion
     * @emits error {Error} On error
     */
    _complete(prompt: string | ChatMessage, model: ChatModel, context?: object): Promise<Response | undefined>;
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
    /**
     * Prepare request for OpenRouter API
     * @param {string|ChatMessage} prompt
     * @param {ChatModel|string} [model]
     * @param {boolean} [stream=false] - Whether this is a streaming request
     * @returns {Promise<object>}
     */
    prepareRequest(prompt: string | ChatMessage, model?: string | ChatModel | undefined, stream?: boolean | undefined): Promise<object>;
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
     * @returns {object | null} Parsed data
     */
    _parseChatCompletionResponseText(text: string, context?: object): object | null;
}
import ChatModel from "../Model/Model.js";
import DB from "@nan0web/db";
import DriverOptions from "./Options.js";
import Response from "../Response.js";
import StreamLog from "../Stream/Log.js";
import ChatChunk from "../Stream/Chunk.js";
import ChatMessage from "../Message.js";
import StreamOptions from "../Stream/Options.js";
