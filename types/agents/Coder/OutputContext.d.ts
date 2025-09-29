export default CoderOutputContext;
declare class CoderOutputContext extends OutputContext {
    /**
     * @param {object} props
     * @param {string} props.cwd
     * @param {Array<{file: string, content: string}>} props.files
     * @param {Array<{value: any, command: string, content: string, type: string}>} props.commands
     * @param {string[]} props.tests
     */
    constructor(props?: {
        cwd: string;
        files: Array<{
            file: string;
            content: string;
        }>;
        commands: Array<{
            value: any;
            command: string;
            content: string;
            type: string;
        }>;
        tests: string[];
    });
    /** @type {string} */
    cwd: string;
    /** @type {Array<{file: string, content: string}>} */
    files: Array<{
        file: string;
        content: string;
    }>;
    /** @type {Array<value: any, command: string, content: string, type: string>} */
    commands: Array<value>;
    /** @type {string[]} */
    tests: string[];
}
import OutputContext from "../Agent/OutputContext.js";
