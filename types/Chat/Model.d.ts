export default ChatModel;
/**
 * Represents a chat model with pricing and token limits
 */
declare class ChatModel {
    static FORMATS: string[];
    static from(props: any): any;
    constructor(props?: {});
    /** @type {string} */
    name: string;
    /** @type {string} */
    provider: string;
    /** @type {ModelContext} */
    context: ModelContext;
    /** @type {ModelFeatures} */
    features: ModelFeatures;
    /** @type {ModelPrices} */
    prices: ModelPrices;
    /** @type {string[]} */
    input: string[];
    /** @type {string[]} */
    output: string[];
    /** @type {string} */
    currency: string;
    get maxInputBytes(): number;
    get maxBytes(): number;
    get empty(): boolean;
    is(name: any): any;
    sanitizeModelFormat(formats?: any[]): any[];
    /**
     * Returns a formatted string representation of the model
     * @returns {string} Formatted model info
     */
    toString(): string;
    /**
     * Calculates the cost for given token usage
     * @param {Usage} usage Token usage data
     * @returns {number} Calculated cost
     */
    calc(usage: Usage): number;
}
import ModelContext from "./Model/Context.js";
import ModelFeatures from "./Model/Features.js";
import ModelPrices from "./Model/Prices.js";
import Usage from "./Usage.js";
