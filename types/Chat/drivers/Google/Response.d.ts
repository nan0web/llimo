export default GeminiResponse;
/**
 * Response class for Gemini API
 */
declare class GeminiResponse extends Response {
    static PROPERTIES: any;
    static ALIASES: {
        responseId: string;
        finishReason: string;
        usageMetadata: string;
        modelVersion: string;
    };
    /**
     * Returns string representation
     * @returns {string} Formatted response
     */
    toString(): string;
}
import Response from "../../Response.js";
