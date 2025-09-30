export default class ChatAgent {
    static ID: string;
    static MESSAGES: {
        goodbye: string[];
    };
    static SYSTEM_MD: string;
    static LOOP_DEFAULTS: {
        maxLoops: number;
    };
    /**
     * @param {any} input
     * @returns {ChatAgent}
     */
    static from(input: any): ChatAgent;
    /**
     * @param {Object} props
     * @param {string[]} [props.inputPipeline=["mightBeIncludes"]]
     * @param {string[]} [props.outputPipeline=[]]
     * @param {string} [props.name="Base Agent v1"]
     * @param {string} [props.desc="Base agent with optional loop; extend for multi-turn tasks"]
     * @param {import("../../App.js").default} props.app
     * @param {DB} props.db
     * @param {DB} props.fs
     */
    constructor(props: {
        inputPipeline?: string[] | undefined;
        outputPipeline?: string[] | undefined;
        name?: string | undefined;
        desc?: string | undefined;
        app: import("../../App.js").default;
        db: DB;
        fs: DB;
    });
    /** @type {string[]} */
    inputPipeline: string[];
    /** @type {string[]} */
    outputPipeline: string[];
    /** @type {string} */
    name: string;
    /** @type {string} */
    desc: string;
    /** @type {import("../../App.js").default} */
    app: import("../../App.js").default;
    /** @type {DB} */
    db: DB;
    /** @type {DB} */
    fs: DB;
    bus: import("@nan0web/event/types").EventBus;
    /** @returns {string} */
    get SYSTEM_MD(): string;
    run(context?: ChatContext, loopOpts?: {
        /**
         * @param {ChatContext} context
         * @returns {Promise<boolean>} Whether to continue chat or not.
         */
        onStepEnd: (context: ChatContext) => Promise<boolean>;
    }): Promise<{
        response: Response;
        context: ChatContext;
    }>;
    /**
     * Determines if the loop should continue (hook for subclasses).
     * @param {object} context - Current context (history, tasks, cancel, loopCount)
     * @returns {boolean} True to continue, false to stop.
     */
    shouldLoop(context: object): boolean;
    /**
     * Builds prompt from context (e.g., system + last history).
     * @param {object} context - Context with history array
     * @returns {ChatMessage} Prompt for next iteration
     */
    buildPromptFromContext(context: object): ChatMessage;
    /**
     * Gets input for single-turn process (override for dynamic input, e.g., next task).
     * @param {ChatContext} context - Current context
     * @returns {ChatMessage} Input for LLM
     */
    getInputFromContext(context: ChatContext): ChatMessage;
    /**
     * Runs a single iteration (transform input → LLM → transform output).
     * @param {ChatMessage} input - Input for this turn
     * @param {object} context - Current context
     * @returns {Promise<{response: Response | null, error: any}>} Single response or error
     */
    runSingleTurn(input: ChatMessage, context: object): Promise<{
        response: Response | null;
        error: any;
    }>;
    /**
     * Updates context after single step (append to history, e.g., tasks update).
     * @param {object} stepResult - {response} from runSingleTurn
     * @param {object} context - Current context (mutable)
     */
    updateContextAfterStep(stepResult: object, context: object): Promise<void>;
    /**
     * Transforms input (pipeline array).
     * @param {ChatMessage} input
     * @param {ChatContext} context
     * @returns {Promise<ChatMessage | {error: Error}>}
     */
    transformInput(input: ChatMessage, context: ChatContext): Promise<ChatMessage | {
        error: Error;
    }>;
    /**
     * Transforms output (pipeline array).
     * @param {Response} response
     * @param {object} context
     * @returns {Promise<Response | {error: Error}>}
     */
    transformOutput(response: Response, context: object): Promise<Response | {
        error: Error;
    }>;
    requireFS(): void;
    /**
     * Creates initial chat (system + configs).
     * @returns {Promise<ChatMessage>}
     */
    createChat(): Promise<ChatMessage>;
    /**
     * @param {ChatContext} context
     * @returns
     */
    mightBeIncludes(context: ChatContext): Promise<boolean>;
}
import DB from "@nan0web/db";
import ChatContext from "./ChatContext.js";
import Response from "../../Chat/Response.js";
import ChatMessage from "../../Chat/Message.js";
