export default DriverOptions;
declare class DriverOptions {
    /**
     *
     * @param {object} props
     * @param {number} props.temperature
     * @param {number} props.max_tokens
     * @param {number} props.top_p
     */
    constructor(props?: {
        temperature: number;
        max_tokens: number;
        top_p: number;
    });
    /** @type {number} */
    temperature: number;
    /** @type {number} */
    max_tokens: number;
    /** @type {number} */
    top_p: number;
}
