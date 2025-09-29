export default OpenAIDriver;
/**
 * Driver for OpenAI API using official SDK
 */
declare class OpenAIDriver extends ChatDriver {
    constructor(input: any);
    /** @type {OpenAI} */
    api: OpenAI;
    getModels(): import("../../Model/Model.js").default[];
    getModel(modelId: any): import("../../Model/Model.js").default;
    requireDb(): Promise<import("@nan0web/db").default>;
    getUsage(start: any, end: any): Promise<AsyncGenerator<string, void, unknown>>;
    getPricingTable(): Promise<{
        usage: any;
        subscription: any;
    }>;
}
import ChatDriver from "../ChatDriver.js";
import OpenAI from "openai";
