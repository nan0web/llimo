export default HuggingFaceModel;
declare class HuggingFaceModel extends Model {
    static from(props: any): HuggingFaceModel;
    /** @type {string} */
    status: string;
    /** @type {Record<string, boolean>} */
    features: Record<string, boolean>;
    /** @type {Record<string, number>} */
    performance: Record<string, number>;
    /** @type {Record<string, string | number | boolean>} */
    author: Record<string, string | number | boolean>;
    /** @type {string} */
    validatedAt: string;
}
import Model from "../../Model/Model.js";
