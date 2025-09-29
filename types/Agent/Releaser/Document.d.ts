export default class ReleaserDocument extends Markdown {
    /**
     *
     * @param {any} input
     * @returns {ReleaserDocument}
     */
    static from(input: any): ReleaserDocument;
    constructor(input: any);
    get release(): any;
    get notes(): any[];
    get groups(): any[];
    get tasks(): any[];
    #private;
}
import Markdown from "@nan0web/markdown";
