export default class SystemMdRules {
    constructor(input?: {});
    console: any;
    /**
     * @param {ChatMessage} message
     * @returns {Promise<boolean>}
     */
    validateInput(message: ChatMessage): Promise<boolean>;
    /**
     * @param {ChatResponse} response
     * @returns {Promise<boolean>}
     */
    validateResponse(response: ChatResponse): Promise<boolean>;
    toString(): string;
}
import ChatMessage from "../Chat/Message.js";
import ChatResponse from "../Chat/Response.js";
