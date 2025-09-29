export default GeminiUsage;
/**
 * Usage data from Gemini response
 */
declare class GeminiUsage extends Usage {
    static PROPERTIES: any;
    static ALIASES: {
        promptTokenCount: string;
        candidatesTokenCount: string;
        totalTokenCount: string;
        thoughtsTokenCount: string;
    };
}
import Usage from "../../Usage.js";
