export default OpenAIDriver;
/**
 * Driver for OpenAI API using official SDK
 */
declare class OpenAIDriver extends ChatDriver {
    constructor(input: any);
    /** @type {OpenAI} */
    api: OpenAI;
    /**
     * @param {any} options
     * @returns {AsyncGenerator<any, any, any>}
     */
    createChatCompletionStream(options: any): AsyncGenerator<any, any, any>;
    getModel(modelId: any): Promise<import("../../Model/Model.js").default>;
    requireDb(): Promise<import("@nan0web/db").default>;
    getUsage(start: any, end: any): Promise<AsyncGenerator<string, void, unknown>>;
}
import ChatDriver from "../ChatDriver.js";
import OpenAI from "openai";
