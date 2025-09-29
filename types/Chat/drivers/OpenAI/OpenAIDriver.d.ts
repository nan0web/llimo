export default OpenAIDriver;
/**
 * Driver for OpenAI API using official SDK
 */
declare class OpenAIDriver extends ChatDriver {
    api: OpenAI | undefined;
    chat(prompt: any, model: any): Promise<Response>;
    storeStarted(): Promise<false | undefined>;
    /**
     *
     * @param {Prompt} prompt
     * @param {Model} model
     * @param {object} context
     * @returns {Promise<Response>}
     */
    _complete(prompt: Prompt, model: Model, context?: object): Promise<Response>;
    getModels(): any[];
    getModel(modelId: any): any;
    requireDb(): Promise<import("@nan0web/db/types/DB.js").default>;
    getUsage(start: any, end: any): Promise<AsyncGenerator<string, void, unknown>>;
    getPricingTable(): Promise<{
        usage: any;
        subscription: any;
    }>;
}
import ChatDriver from "../ChatDriver.js";
import OpenAI from "openai";
import Response from "../../Response.js";
import Prompt from "../../Prompt.js";
import Model from "../../Model.js";
