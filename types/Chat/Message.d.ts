export default ChatMessage;
/**
 * @todo convert to simple class (get rid of NanoElement)
 * @extends {Prompt}
 * @property {string} username
 */
declare class ChatMessage extends Prompt {
    static PROMPT_END_WORD: string;
    static ROLES: {
        user: string;
        assistant: string;
        system: string;
        os: string;
    };
    static SHORT_ROLES_ALIASES: {
        user: string;
    };
    static LOG_ROLES_KEYWORDS: {
        assistant: string;
        system: string;
        user: string;
        os: string;
    };
    /**
     * @param {object} [props={}]
     * @returns {ChatMessage}
     */
    static from(props?: object): ChatMessage;
    /**
     * @param {string|object} log - The log.md to parse.
     * @returns {ChatMessage}
     */
    static fromLog(log: string | object): ChatMessage;
    /**
     * @type {string}
     */
    username: string;
    /** @type {number} */
    count: number;
    get size(): number;
    /**
     * @returns {ChatMessage}
     */
    get recent(): ChatMessage;
    get empty(): boolean;
    get ended(): boolean;
    get messagesCount(): number;
    get systemMessages(): ContainerObject[];
    /**
     * Adds a nested message to the current instance.
     * @param {ChatMessage} message - The element to add (can be an object or string).
     * @returns {ChatMessage}
     */
    add(message: ChatMessage): ChatMessage;
    sumCount(): void;
    /**
     * @param {object} [props={}]
     * @param {boolean|string} [props.format=false] - true or "short" for aligned output.
     * @param {boolean} [props.avoidTags=false]
     * @param {number} [props.level=0]
     * @param {string} [props.tab=""]
     * @param {number[]} [props.columns] - Custom column widths: [role, username, content]
     * @param {number} [props.padding=1] - Spacing between columns
     * @returns {string}
     */
    toString({ format, avoidTags, level, tab, columns, padding }?: {
        format?: string | boolean | undefined;
        avoidTags?: boolean | undefined;
        level?: number | undefined;
        tab?: string | undefined;
        columns?: number[] | undefined;
        padding?: number | undefined;
    } | undefined): string;
    toLog(): string;
    /**
     * @param {ChatMessage} recent
     * @returns {boolean}
     */
    isRecent(recent: ChatMessage): boolean;
}
import Prompt from "./Prompt.js";
import { ContainerObject } from "@nan0web/types";
