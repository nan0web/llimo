export default CoderAgent;
export type ParsedFileBlock = {
    filePath: string;
    content: string;
    type: string | null;
};
/**
 * @typedef {object} ParsedFileBlock
 * @property {string} filePath
 * @property {string} content
 * @property {string|null} type
 */
/**
 * CoderAgent executes transformation pipeline for code-related LLM messages.
 * @requires this.app.requireSave(chat, context)
 * @requires this.app.requireTest(chat, context)
 * @requires this.app.ask({ label, options: ["Yes", "No"] })
 * @requires this.app.view.filesSaved({ files: Array<{file: string, content: string}> })
 */
declare class CoderAgent extends Agent {
    static OutputContext: typeof CoderOutputContext;
    _requireMessage(chat: any): any;
    _requireAssistant(message: any): any;
    _requireCwd(context: any): any;
    /**
     *
     * @param {ChatMessage} chat
     * @param {} context
     * @param {Response} context.prevResponse
     * @returns
     */
    requireEmptyResponse(chat: ChatMessage, context?: any): Promise<boolean>;
    /**
     * Extract files from LLM response and store in context
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} [context={}]
     * @returns {Promise<true>}
     */
    requireFilesAndCommands(chat: ChatMessage, context?: CoderOutputContext | undefined): Promise<true>;
    /**
     * Extract .:need blocks if any to detect missing required files
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} [context={}]
     * @returns {Promise<true>}
     */
    requireMissingCode(chat: ChatMessage, context?: CoderOutputContext | undefined): Promise<true>;
    /**
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} [context={}]
     * @returns {Promise<true | string>}
     */
    requireSave(chat: ChatMessage, context?: CoderOutputContext | undefined): Promise<true | string>;
    /**
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} context
     * @returns
     */
    requireTests(chat: ChatMessage, context?: CoderOutputContext, target?: string): Promise<true | ChatMessage>;
    /**
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} context
     * @returns {Promise<Boolean>}
     */
    requireLocalTest(chat: ChatMessage, context?: CoderOutputContext): Promise<boolean>;
    /**
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} context
     * @returns {Promise<Boolean>}
     */
    requireProjectTest(chat: ChatMessage, context?: CoderOutputContext): Promise<boolean>;
    /**
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} context
     */
    requireAnything(chat: ChatMessage, context?: CoderOutputContext): Promise<true | ChatMessage>;
    decode(content: any): {
        files: Array<{
            file: string;
            content: string;
            type: string;
        }>;
        commands: {
            [key: string]: string;
            command: string;
            content: string;
            type: string;
        }[];
    };
    /**
     * Parses the given content into file and command blocks.
     *
     * @param {string} content - The raw input content containing file or command blocks.
     * @returns {{
     *   files: Array<{
     *     file: string,
     *     content: string,
     *     type: string
     *   }>,
     *   commands: Array<{
     *     command: string,
     *     content: string,
     *     type: string,
     *     [key: string]: string
     *   }>
     * }} An object containing arrays of parsed file entries and command entries.
     */
    parse(content: string): {
        files: Array<{
            file: string;
            content: string;
            type: string;
        }>;
        commands: {
            [key: string]: string;
            command: string;
            content: string;
            type: string;
        }[];
    };
    parseBlocks(content: any): {
        files: {
            file: string;
            content: any;
        }[];
        commands: any[];
        messages: {
            status: any;
            text: any;
        }[];
        requests: any[];
    };
    normalizeEscapedContent(content: any): any;
    normalizeInputAttrs(attrs?: {}): {};
    parseFileBlocks(content: any): {
        filePath: string;
        content: any;
        type: string | null;
    }[];
    parseDiff(diff: any): {};
    parseMeMD(content: any, cwd?: string): Promise<{
        message: ChatMessage;
        content: any;
        processed: any;
        includes: any[];
        tests: any[];
    }>;
}
import Agent from "../Agent/Agent.js";
import ChatMessage from "../../Chat/Message.js";
import CoderOutputContext from "./OutputContext.js";
