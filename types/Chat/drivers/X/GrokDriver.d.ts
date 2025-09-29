export default GrokDriver;
/**
 * Driver for xAI Grok API
 */
declare class GrokDriver extends ChatDriver {
    static MODELS: {
        grok_3: any;
        grok_3_fast: any;
        grok_3_mini: any;
        grok_3_mini_fast: any;
        grok_manual: any;
    };
    /**
     * Processes text by removing artifacts
     * @param {string} text Input text
     * @returns {string} Processed text
     */
    processText(text: string): string;
}
import ChatDriver from "../ChatDriver.js";
