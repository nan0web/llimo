export default ModelContext;
declare class ModelContext {
    static from(props?: {}): ModelContext;
    constructor(props?: {});
    /** @type {String} */
    name: string;
    /** @type {Number} */
    window: number;
    /** @type {Number} */
    input: number;
    /** @type {Number} */
    output: number;
    /** @type {String} */
    date: string;
    /**
     * @param {number} tokensCount
     * @returns {number}
     */
    available(tokensCount?: number): number;
    toString(): string;
}
