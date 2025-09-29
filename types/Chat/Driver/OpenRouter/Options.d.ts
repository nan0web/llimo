export default OpenRouterOptions;
declare class OpenRouterOptions extends DriverOptions {
    /**
     * @param {any} input
     * @returns {OpenRouterOptions}
     */
    static from(input: any): OpenRouterOptions;
    /**
     * @param {Object} input
     * @param {number} [input.temperature]
     * @param {number} [input.max_tokens]
     * @param {number} [input.top_p]
     * @param {string} [input.endpoint=""]
     * @param {string} [input.referer=""]
     * @param {string} [input.title=""]
     * @param {number} [input.timeout=30_000]
     * @param {boolean} [input.useCache=false]
     */
    constructor(input?: {
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        top_p?: number | undefined;
        endpoint?: string | undefined;
        referer?: string | undefined;
        title?: string | undefined;
        timeout?: number | undefined;
        useCache?: boolean | undefined;
    });
    /** @type {string} */
    endpoint: string;
    /** @type {string} */
    referer: string;
    /** @type {string} */
    title: string;
    /** @type {number} */
    timeout: number;
    /** @type {boolean} */
    useCache: boolean;
}
import DriverOptions from "../Options.js";
