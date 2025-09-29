export default class ReleaserAgent extends ChatAgent {
    static desc: string;
    /**
     * @param {object} stepResult
     * @param {ReleaserChatContext} context
     * @returns {Promise<void>}
     */
    updateTasksFromResponse(stepResult: object, context: ReleaserChatContext): Promise<void>;
}
import ChatAgent from "../Chat/ChatAgent.js";
import ReleaserChatContext from "./ChatContext.js";
