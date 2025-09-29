export default class MDTask extends MDHeading3 {
    /**
     * @param {any} input
     * @returns {MDTask}
     */
    static from(input: any): MDTask;
    constructor(input: any);
    id: string;
    toString(): string;
    toJSON(): {
        id: string;
        content: string;
    };
}
import { MDHeading3 } from '@nan0web/markdown';
