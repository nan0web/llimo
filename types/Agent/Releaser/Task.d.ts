export default class ReleaserTask {
    static STATUSES: {
        pending: string;
        process: string;
        done: string;
    };
    /**
     * @param {any} input
     * @returns {ReleaserTask}
     */
    static from(input: any): ReleaserTask;
    constructor(input: any);
    status: string;
    id: string;
    desc: string;
    toJSON(): {
        id: string;
        desc: string;
        status: string;
    };
}
