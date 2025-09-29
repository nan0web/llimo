export default DriverOptions;
declare class DriverOptions {
    /**
     * @param {any} input
     * @returns {DriverOptions}
     */
    static from(input: any): DriverOptions;
    /**
     *
     * @param {object} [props]
     * @param {number} [props.temperature]
     * @param {number} [props.max_tokens]
     * @param {number} [props.top_p]
     * @param {string} [props.provider]
     */
    constructor(props?: {
        temperature?: number | undefined;
        max_tokens?: number | undefined;
        top_p?: number | undefined;
        provider?: string | undefined;
    } | undefined);
    /** @type {number | undefined} */
    temperature: number | undefined;
    /** @type {number | undefined} */
    max_tokens: number | undefined;
    /** @type {number | undefined} */
    top_p: number | undefined;
    /** @type {string | undefined} */
    provider: string | undefined;
}
