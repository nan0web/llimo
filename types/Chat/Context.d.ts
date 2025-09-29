export default ChatContext;
declare class ChatContext {
    /**
     * @todo add jsdoc
     */
    constructor(props?: {});
    /** @type {string} */
    cwd: string;
    /** @type {string} */
    model: string;
    /** @type {Model} */
    provider: Model;
    /** @type {ChatProvider} */
    agent: ChatProvider;
    /** @type {Agent} */
    chat: Agent;
    /** @type {ChatMessage} */
    prevResponse: ChatMessage;
    /** @type {Response} */
    inputFile: Response;
    /** @type {string} */
    chatFile: string;
    /** @type {string} */
    promptFile: string;
    /** @type {string} */
    responseFile: string;
    /** @type {string} */
    streamFile: string;
}
import Model from "./Model.js";
import ChatProvider from "./Provider.js";
import { Agent } from "../agents/index.js";
import ChatMessage from "./Message.js";
