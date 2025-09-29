export default ModelFeatures;
declare class ModelFeatures {
    static from(props?: {}): ModelFeatures;
    constructor(props?: {});
    /** @type {boolean} */
    chatCompletions: boolean;
    /** @type {boolean} */
    assistants: boolean;
    toString(): string;
}
