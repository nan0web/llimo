export default ModelPrices;
declare class ModelPrices extends ObjectWithAlias {
    static ALIAS: {
        i: string;
        o: string;
        db: string;
    };
    static SAVE_FIRST_PROP: string;
    /**
     *
     * @param {any} props
     * @returns {ModelPrices}
     */
    static from(props?: any): ModelPrices;
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
