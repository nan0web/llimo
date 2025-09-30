export default class ChatContext {
    /**
     * @param {Object} input
     * @param {string} [input.cwd]
     * @param {ChatModel} [input.model]
     * @param {ChatProvider} [input.provider]
     * @param {ChatAgent} [input.agent]
     * @param {ChatMessage} [input.chat]
     * @param {ChatResponse} [input.prevResponse]
     * @param {string} [input.inputFile]
     * @param {string} [input.chatFile]
     * @param {string} [input.promptFile]
     * @param {string} [input.responseFile]
     * @param {string} [input.streamFile]
     * @param {boolean} [input.cancelled]
     */
    constructor(input: {
        cwd?: string | undefined;
        model?: ChatModel | undefined;
        provider?: ChatProvider | undefined;
        agent?: ChatAgent | undefined;
        chat?: ChatMessage | undefined;
        prevResponse?: ChatResponse | undefined;
        inputFile?: string | undefined;
        chatFile?: string | undefined;
        promptFile?: string | undefined;
        responseFile?: string | undefined;
        streamFile?: string | undefined;
        cancelled?: boolean | undefined;
    });
    /** @type {string} */
    cwd: string;
    /** @type {ChatModel} */
    model: ChatModel;
    /** @type {ChatProvider | undefined} */
    provider: ChatProvider | undefined;
    /** @type {ChatAgent} */
    agent: ChatAgent;
    /** @type {ChatMessage} */
    prompt: ChatMessage;
    /** @type {ChatMessage} */
    chat: ChatMessage;
    /** @type {ChatResponse} */
    prevResponse: ChatResponse;
    /** @type {string} */
    input: string;
    /** @type {string} */
    inputFile: string;
    /** @type {string} */
    chatFile: string;
    /** @type {string} */
    promptFile: string;
    /** @type {string} */
    responseFile: string;
    /** @type {string} */
    streamFile: string;
    /** @returns {number} */
    get loopCount(): number;
    get cancelled(): boolean;
    cancel(): void;
    /**
     * Sets prevResponse
     * @param {ChatResponse} response
     */
    setResponse(response: ChatResponse): void;
    get history(): ChatMessage[];
    #private;
}
import ChatModel from "../../Chat/Model/Model.js";
import ChatProvider from "../../Chat/Provider.js";
import ChatAgent from "./ChatAgent.js";
import ChatMessage from "../../Chat/Message.js";
import ChatResponse from "../../Chat/Response.js";
