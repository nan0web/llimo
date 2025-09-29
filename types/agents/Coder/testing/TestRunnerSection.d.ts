export default TestRunnerSection;
declare class TestRunnerSection {
    static COLLECTING_FILES: string;
    static RUNNING_TESTS: RegExp;
    static FAILED_TESTS: RegExp;
    static RESULTS: RegExp;
    static parse(line: any): TestRunnerSection | null;
    static parseAll(lines: any): any[];
    /**
     * @param {object} props
     * @param {string|RegExp} props.active
     * @param {string} props.line
     */
    constructor(props?: {
        active: string | RegExp;
        line: string;
    });
    /** @type {string|RegExp} */
    active: string | RegExp;
    /** @type {string|RegExp[]} */
    line: string | RegExp[];
    /** @type {string[]} */
    content: string[];
    toString(): string | RegExp[];
}
