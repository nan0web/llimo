export default ClaudeDriver;
/**
 * Driver for Anthropic Claude API
 */
declare class ClaudeDriver extends ChatDriver {
    static BATCH_ENDPOINT: string;
    static MODELS: {
        claude_opus_4: any;
        claude_sonnet_4: any;
        claude_haiku_3_5: any;
    };
}
import ChatDriver from "../ChatDriver.js";
