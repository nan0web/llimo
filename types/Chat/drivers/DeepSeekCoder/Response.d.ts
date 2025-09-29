export default DeepSeekCoderResponse;
/**
 * Response class for DeepSeek Coder
 */
declare class DeepSeekCoderResponse extends Response {
    static PROPERTIES: any;
    static ALIASES: {
        responseId: string;
        finishReason: string;
    };
    /**
     * Returns string representation
     * @returns {string} Formatted response
     */
    toString(): string;
}
import Response from "../../Response.js";
