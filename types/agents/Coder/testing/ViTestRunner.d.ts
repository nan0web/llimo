export default ViTestRunner;
/**
 * Usage:
 * import ViTestRunner from "./apps/cli/src/tests/ViTestRunner.js"
 * const runner = new ViTestRunner(process.cwd())
 * runner.run(process.argv.slice(2))
 */
declare class ViTestRunner extends TestRunner {
    constructor(cwd: any);
    run(args: any, command: any): Promise<false | undefined>;
}
import TestRunner from "./TestRunner.js";
