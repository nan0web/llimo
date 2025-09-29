export default CerebrasDriver;
declare class CerebrasDriver extends OpenAIDriver {
    static MODELS: {
        [k: string]: import("../../Model/Model.js").default;
    };
    /** @type {Cerebras} */
    api: Cerebras;
}
import OpenAIDriver from '../OpenAI/OpenAIDriver.js';
import Cerebras from '@cerebras/cerebras_cloud_sdk';
