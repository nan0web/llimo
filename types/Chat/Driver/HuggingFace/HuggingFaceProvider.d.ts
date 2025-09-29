export default HuggingFaceProvider;
declare class HuggingFaceProvider {
    constructor(props?: {});
    /** @type {string} */
    name: string;
    /** @type {string} */
    url: string;
    /** @type {HuggingFaceModel[]} */
    models: HuggingFaceModel[];
    find(name: any): any;
    toString(): string;
}
import HuggingFaceModel from "./HuggingFaceModel.js";
