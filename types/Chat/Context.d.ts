export default class ChatContext {
    /**
     * @param {Object} props
     * @param {string} [props.cwd]
     * @param {ChatModel} [props.model]
     * @param {ChatProvider} [props.provider]
     * @param {ChatAgent} props.agent
     * @param {ChatMessage} [props.prompt]
     * @param {ChatMessage} [props.chat]
     * @param {ChatResponse} [props.prevResponse]
     * @param {string} [props.input]
     * @param {string} [props.inputFile]
     * @param {string} [props.chatFile]
     * @param {string} [props.promptFile]
     * @param {string} [props.responseFile]
     * @param {string} [props.streamFile]
     * @param {boolean} [props.cancelled]
     */
    constructor(props: {
        cwd?: string | undefined;
        model?: ChatModel | undefined;
        provider?: ChatProvider | undefined;
        agent: ChatAgent;
        prompt?: ChatMessage | undefined;
        chat?: ChatMessage | undefined;
        prevResponse?: ChatResponse | undefined;
        input?: string | undefined;
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
    /** @type {ChatProvider} */
    provider: ChatProvider;
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
    #private;
}
import ChatModel from "./Model/Model.js";
import ChatProvider from "./Provider.js";
import ChatAgent from "../Agent/Chat/ChatAgent.js";
import ChatMessage from "./Message.js";
import ChatResponse from "./Response.js";
