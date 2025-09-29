export default GeminiDriver;
/**
 * Driver for Google Gemini API
 */
declare class GeminiDriver extends ChatDriver {
    static Prompt: typeof GeminiPrompt;
    static Response: typeof GeminiResponse;
    static MODELS: {
        gemini_2_5_flash: any;
        gemini_2_5_pro: any;
    };
    /**
     * Completes prompt using Gemini model
     * @param {string|Prompt} prompt Input prompt
     * @param {Model} model Model to use
     * @param {object} [context={}] Context for events
     * @returns {Promise<Response>} Response
     * @emits start {Object} Before starting request
     * @emits completeInterval {Object} During request (every 99ms)
     * @emits data {Object} On receiving data chunk
     * @emits end {Response} On completion
     * @emits error {Error} On error
     */
    complete(prompt: string | Prompt, model: Model, context?: object): Promise<Response>;
}
import ChatDriver from "../ChatDriver.js";
import Model from "../../Model.js";
import GeminiPrompt from "./Prompt.js";
import GeminiResponse from "./Response.js";
