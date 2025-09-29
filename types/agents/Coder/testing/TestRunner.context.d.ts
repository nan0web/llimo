declare namespace _default {
    export { onlyFiles };
    export { single };
    export { multiple };
}
export default _default;
declare const onlyFiles: Scenario;
declare const single: Scenario;
declare const multiple: Scenario;
declare class Scenario {
    static fromArray(arr: any): Scenario;
    constructor(props?: {});
    /** @type {ScenarioLine[]} */
    rows: ScenarioLine[];
}
declare class ScenarioLine {
    /**
     * @param {object} props
     * @param {string} props.value
     * @param {TestRunnerExpect|object} [props.exp={}]
     * @param {{value: string, exp: TestRunnerExpect}} [props.exp={}]
     */
    constructor(props?: {
        value: string;
        exp?: TestRunnerExpect | object;
        exp?: any;
    });
    /** @type {string} */
    value: string;
    /** @type {TestRunnerExpect} */
    exp: TestRunnerExpect;
    toString(): string;
}
import TestRunnerExpect from "./TestRunnerExpect.js";
