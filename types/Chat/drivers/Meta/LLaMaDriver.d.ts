export default LLaMADriver;
/**
 * Driver for LLaMA API
 */
declare class LLaMADriver extends ChatDriver {
    static MODELS: {
        llama: any;
    };
    static Prompt: typeof QwenPrompt;
    /**
     * Gets request options for API
     * @param {Prompt|function} prompt Prompt or function
     * @returns {object} Request options
     */
    _request(prompt: Prompt | Function): object;
}
import ChatDriver from "../ChatDriver.js";
import Prompt from "../../Prompt.js";
/**
 * Prompt class for LLaMA API
 */
declare class QwenPrompt extends Prompt {
    /**
     * Returns string representation
     * @param {boolean} [avoidTags=false] - Avoid LLM specific tags, especially for tokenization.
     * @returns {string} Formatted prompt
     */
    toString(avoidTags?: boolean | undefined): string;
}
