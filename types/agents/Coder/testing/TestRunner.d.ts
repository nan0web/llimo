export default TestRunner;
/**
 * TestRunner class for running tests and handling test results.
 */
declare class TestRunner extends NanoEvent {
    static FAILED_TESTS_HEADER: string;
    static TOTAL_FILES_HEADER: string;
    static FAILED_TESTS_END: RegExp;
    static Section: typeof TestRunnerSection;
    /**
     * @param {string} cwd - The current working directory.
     */
    constructor(cwd: string);
    command: string;
    cwd: string;
    stdout: any[];
    stderr: any[];
    /**
     * Processes each line of the test output.
     * @param {object} props
     * @param {number} props.index - The line of output.
     * @param {TestRunnerExpect} props.total - The total test results.
     * @param {string[]} props.lines - The array of lines.
     */
    processLine({ index, total: initialTotal, lines }: {
        index: number;
        total: TestRunnerExpect;
        lines: string[];
    }): TestRunnerExpect;
    /**
     * Runs the test command and handles the output.
     * @param {string[]} args - The arguments for the test command.
     * @param {string} testCommand - The test command to run.
     * @returns {Promise<object>} - The total test results.
     */
    run(args?: string[], testCommand?: string): Promise<object>;
}
import NanoEvent from '@yaro.page/nano-events';
import TestRunnerExpect from './TestRunnerExpect.js';
import TestRunnerSection from './TestRunnerSection.js';
