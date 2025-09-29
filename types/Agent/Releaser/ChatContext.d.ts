export default class ReleaserChatContext extends ChatContext {
    constructor(input?: {});
    /** @type {ReleaserTask[]} */
    tasks: ReleaserTask[];
    /**
     * Sets prevResponse
     * @param {ChatResponse} response
     */
    setResponse(response: ChatResponse): void;
    toJSON(): any;
}
import ChatContext from "../../Chat/Context.js";
import ReleaserTask from "./Task.js";
