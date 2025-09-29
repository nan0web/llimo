export default class MDRelease extends MDHeading1 {
    /**
     * @param {any} input
     * @returns {MDRelease}
     */
    static from(input: any): MDRelease;
    /**
     * Parses the string of the heading with the version in a format {name} - {vX.Y.Z}
     * @param {string} str
     */
    static parse(str: string): MDRelease;
    constructor(input?: {});
    name: any;
    major: any;
    minor: any;
    patch: any;
    get version(): string;
    toString(): string;
}
import { MDHeading1 } from "@nan0web/markdown";
