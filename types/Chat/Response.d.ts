export default ChatResponse;
/**
 * Represents a chat response with additional metadata
 */
declare class ChatResponse extends ChatMessage {
    static ALIAS: {
        responseId: string;
        requestId: string;
        finishReason: string;
    };
    /**
     * Creates response from various input types
     * @param {object|string|ChatMessage} input Response data
     * @param {ChatModel} [model] Model for cost calculation
     * @returns {ChatResponse} Response instance
     */
    static from(input: object | string | ChatMessage, model?: ChatModel | undefined): ChatResponse;
    static fromLog(log: any): ChatResponse;
    /**
     * @param {Partial<ChatResponse>} input
     * @param {string | object} input
     */
    constructor(input: Partial<ChatResponse>);
    /** @type {string} **/
    thought: string;
    /** @type {string} **/
    request_id: string;
    /** @type {string} **/
    response_id: string;
    /** @type {string} **/
    model: string;
    /** @type {ChatUsage} **/
    usage: ChatUsage;
    /** @type {string} **/
    finish_reason: string;
    /** @type {boolean} **/
    complete: boolean;
    /** @type {number} **/
    spentMs: number;
    /** @type {Date} **/
    startedAt: Date;
    sanitize(): void;
    get speed(): number;
}
import ChatMessage from "./Message.js";
import ChatUsage from "./Usage.js";
import ChatModel from "./Model/Model.js";
