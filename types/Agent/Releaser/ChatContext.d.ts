export default class ReleaserChatContext extends ChatContext {
    constructor(input: any);
    /** @type {ReleaserTask[]} */
    tasks: ReleaserTask[];
    /**
     * Sets prevResponse
     * @param {Response} response
     */
    setResponse(response: Response): void;
    toJSON(): this & {
        tasks: {
            id: string;
            desc: string;
            status: string;
        }[];
    };
}
import ChatContext from "../../Chat/Context.js";
import ReleaserTask from "./Task.js";
import Response from "../../Chat/Response.js";
