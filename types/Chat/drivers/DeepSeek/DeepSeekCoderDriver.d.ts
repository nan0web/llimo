export default DeepSeekCoderDriver;
/**
 * Driver for DeepSeek Coder API
 */
declare class DeepSeekCoderDriver extends ChatDriver {
    static Prompt: typeof Prompt;
    static Response: typeof DeepSeekCoderResponse;
    static MODELS: {
        "deepseek-coder-v2-lite-instruct": any;
        "deepseek-coder-v2-instruct": any;
    };
    /**
     * Prepares chat completion request
     * @param {Prompt|function} prompt Prompt or function
     * @returns {object} Request options
     */
    _chatCompletionRequest(prompt: Prompt | Function): object;
    /**
     * Parses completion response
     * @param {object} res API response
     * @returns {object} Parsed data
     * @throws {Error} On parse failure
     */
    _parseChatCompletionResponse(res: object): object;
    /**
     * Extracts files from response
     * @param {Response} response Response object
     * @returns {object} Files dictionary
     */
    extractFiles(response: Response): object;
}
import ChatDriver from "../ChatDriver.js";
import Prompt from "../../Prompt.js";
import DeepSeekCoderResponse from "../DeepSeekCoder/Response.js";
