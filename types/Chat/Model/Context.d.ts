export default ModelContext;
export type Context = {
    name?: string | undefined;
    window?: number | undefined;
    input?: number | undefined;
    output?: number | undefined;
    isModerated?: boolean | undefined;
    date?: string | undefined;
};
/**
 * @typedef {object} Context
 * @property {String} [name=""]
 * @property {Number} [window=0]
 * @property {Number} [input=0]
 * @property {Number} [output=0]
 * @property {Boolean} [isModerated=false]
 * @property {String} [date=""]
 */
declare class ModelContext {
    /**
     * @param {Context | object} props
     * @returns {ModelContext}
     */
    static from(props?: Context | object): ModelContext;
    /**
     * @param {Context} props
     */
    constructor(props?: Context);
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
    isModerated: boolean;
    get empty(): boolean;
    /**
     * @param {number} tokensCount
     * @returns {number}
     */
    available(tokensCount?: number): number;
    toString(): string;
}
