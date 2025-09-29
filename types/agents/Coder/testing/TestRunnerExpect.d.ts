export default TestRunnerExpect;
declare class TestRunnerExpect {
    static parseSections(sections?: any[]): TestRunnerExpect;
    static from(props: any): TestRunnerExpect;
    /**
     *
     * @param {object} props
     * @param {string[]} props.files
     * @param {number} props.totalFiles
     * @param {string} props.run
     * @param {number} props.tests
     * @param {number} props.skipped
     * @param {number} props.time
     * @param {number} props.passedFiles
     * @param {number} props.failedFiles
     * @param {number} props.skippedFiles
     * @param {number} props.passed
     * @param {number} props.failed
     * @param {number} props.total
     * @param {VitestLogDuration} props.duration
     */
    constructor(props?: {
        files: string[];
        totalFiles: number;
        run: string;
        tests: number;
        skipped: number;
        time: number;
        passedFiles: number;
        failedFiles: number;
        skippedFiles: number;
        passed: number;
        failed: number;
        total: number;
        duration: VitestLogDuration;
    });
    /** @type {string[]} */
    files: string[];
    /** @type {number} */
    totalFiles: number;
    /** @type {string} */
    run: string;
    /** @type {number} */
    tests: number;
    /** @type {number} */
    skipped: number;
    /** @type {number} */
    time: number;
    /** @type {number} */
    passedFiles: number;
    /** @type {number} */
    failedFiles: number;
    /** @type {number} */
    skippedFiles: number;
    /** @type {number} */
    passed: number;
    /** @type {number} */
    failed: number;
    /** @type {number} */
    total: number;
    /** @type {VitestLogDuration} */
    duration: VitestLogDuration;
    /** @type {string[]} */
    processedFiles: string[];
    toString(): string;
    /**
     * Show the difference between two TestRunnerExpect objects.
     * @param {TestRunnerExpect} other - The other TestRunnerExpect object to compare.
     * @returns {object} - The difference between the two objects.
     */
    diff(other: TestRunnerExpect): object;
}
import VitestLogDuration from "./VitestLogDuration.js";
