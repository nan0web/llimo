export default Prompt;
/**
 * Represents a chat prompt with role and content
 * @property {string} role
 * @property {string} content
 */
declare class Prompt extends ContainerObject {
    static ROLES: {
        user: string;
        assistant: string;
        system: string;
    };
    /**
     * Creates prompt from various input types
     * @param {object|string|array} props Prompt data
     * @returns {Prompt} Prompt instance
     */
    static from(props: object | string | any[]): Prompt;
    constructor(props?: {});
    /**
     * @type {string}
     */
    role: string;
    /**
     * @type {string}
     */
    content: string;
}
import { ContainerObject } from "@nan0web/types";
