export default HFDriverOptions;
declare class HFDriverOptions extends DriverOptions {
    static from(props: any): HFDriverOptions;
    constructor(props?: {});
    /** @type {string} */
    provider: string;
}
import DriverOptions from "../Options.js";
