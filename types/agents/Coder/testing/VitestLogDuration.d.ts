export default VitestLogDuration;
declare class VitestLogDuration {
    static parse(line: any): VitestLogDuration | null;
    constructor(props?: {});
    /** @type {number} */
    total: number;
    /** @type {number} */
    transform: number;
    /** @type {number} */
    setup: number;
    /** @type {number} */
    collect: number;
    /** @type {number} */
    tests: number;
    /** @type {number} */
    environment: number;
    /** @type {number} */
    prepare: number;
}
