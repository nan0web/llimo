export default ModelPrices;
declare class ModelPrices extends ObjectWithAlias {
    static ALIAS: {
        i: string;
        o: string;
        db: string;
    };
    static SAVE_FIRST_PROP: string;
    static from(props?: {}): ObjectWithAlias;
    /**
     * @param {string} uri
     * @param {object} props
     */
    constructor(props?: object);
    /** @type {number} */
    input: number;
    /** @type {number} */
    output: number;
    /** @type {number} */
    cache: number;
    /** @type {number} */
    batchDiscount: number;
    /** @type {number} */
    speed: number;
    /** @type {string} */
    currency: string;
}
import { ObjectWithAlias } from "@nan0web/types";
