export default HuggingFaceProvider;
declare class HuggingFaceProvider {
    constructor(props?: {});
    /** @type {string} */
    name: string;
    /** @type {string} */
    url: string;
    /** @type {Model[]} */
    models: Model[];
    find(name: any): any;
}
