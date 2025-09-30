export default HuggingFaceModel;
declare class HuggingFaceModel extends ChatModel {
    static from(props: any): HuggingFaceModel;
    /** @type {string} */
    status: string;
    /** @type {Record<string, number>} */
    performance: Record<string, number>;
    /** @type {Record<string, string | number | boolean>} */
    author: Record<string, string | number | boolean>;
    /** @type {string} */
    validatedAt: string;
}
import ChatModel from "../../Model/Model.js";
