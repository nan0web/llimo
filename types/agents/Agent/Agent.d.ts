export default Agent;
/**
 * Agent provides shared logic for communication between LLM and user context.
 * @requires this.app.chatProvider.driver
 * @requires this.app.chatModel
 * @requires this.app.findConfigs({ uri: "system.md", allowedExt: [".md"], configs })
 * @requires this.app.chatProvider.driver.getTokensCount(message)
 */
declare class Agent extends NanoEvent {
    static ID: string;
    static MESSAGES: {
        goodbye: string[];
    };
    static SYSTEM_MD: string;
    constructor(props?: {});
    /** @type {string[]} */
    inputPipeline: string[];
    /** @type {string[]} */
    outputPipeline: string[];
    /**
     * @type {string}
     */
    name: string;
    /**
     * @type {string}
     */
    desc: string;
    /** @type {App} */
    app: App;
    /** @type {DB} */
    db: DB;
    /**
     * @param {ChatMessage} chat
     * @param {OutputContext} [context={}]
     * @returns {true | any} True on successm and error message on failure.
     */
    transformOutput(chat: ChatMessage, context?: OutputContext | undefined): true | any;
    /**
     * @param {ChatMessage} chat
     * @param {InputContext} context
     * @returns {true | any} True on successm and error message on failure.
     */
    transformInput(chat: ChatMessage, context?: InputContext): true | any;
    /**
     * @emits process.start
     * @emits process.data
     * @emits process.end
     * @param {ChatMessage} chat
     * @param {object} context
     * @returns {Response}
     */
    process(chat: ChatMessage, context?: object): Response;
    /**
     * Creates a first (root) message with the system instructions.
     * @returns {ChatMessage}
     */
    createChat(): ChatMessage;
    /**
     * @param {{
     *   chat: string,          // content of chat.md
     *   prompt: string,        // content of prompt.md
     *   response: string,      // content of response.md
     *   stream: string,        // content of stream.md
     *   log: object            // parsed content of log.json
     * }} content - Loaded content of the files.
     * @returns {ChatMessage}
     */
    loadChat(content: {
        chat: string;
        prompt: string;
        response: string;
        stream: string;
        log: object;
    }): ChatMessage;
    /**
     * @param {ChatMessage|string} message
     */
    getTokensCount(message: ChatMessage | string): Promise<number>;
    requireDB(): boolean;
    parseMeMD(content: any, cwd?: string): Promise<{
        message: ChatMessage;
        content: any;
        processed: any;
        includes: any[];
    }>;
}
import NanoEvent from "@yaro.page/nano-events";
import App from "../../App.js";
import DB from "@nan0web/db";
import ChatMessage from "../../Chat/Message.js";
import OutputContext from "./OutputContext.js";
import InputContext from "./InputContext.js";
import Response from "../../Chat/Response.js";
