export default App;
declare class App {
    constructor(props?: {});
    /** @type {string} */
    configFile: string;
    /** @type {ChatProvider} */
    chatProvider: ChatProvider;
    /** @type {ChatModel} */
    chatModel: ChatModel;
    /** @type {ChatMessage} */
    chat: ChatMessage;
    /** @type {DB} */
    db: DB;
    /** @type {View} */
    view: View;
    bus: import("@nan0web/event/types").EventBus;
    /**
     * Resolves this.db as a document database.
     */
    requireDB(): Promise<void>;
    requireProvider(): Promise<void>;
    requireModel(): Promise<void>;
    requireChatInput(): Promise<void>;
    /**
     * Asks to save files [context.files].
     * @param {ChatMessage} chat
     * @param {ChatContext} context
     */
    requireSave(chat: ChatMessage, context: ChatContext): Promise<void>;
    /**
     * Asks to run tests [context.tests].
     * @param {ChatMessage} chat
     * @param {ChatContext} context
     */
    requireTest(chat: ChatMessage, context: ChatContext): Promise<void>;
    findConfigs({ uri, configs, allowedExt }: {
        uri?: string | undefined;
        configs?: Map<any, any> | undefined;
        allowedExt?: string[] | undefined;
    }): Promise<Map<any, any>>;
    loadConfig(uri?: string, configs?: Map<any, any>): Promise<{}>;
    loadConfigFile(uri: any): Promise<any>;
}
import ChatProvider from "./Chat/Provider.js";
import ChatModel from "./Chat/Model/Model.js";
import ChatMessage from "./Chat/Message.js";
import DB from "@nan0web/db";
import { View } from "@nan0web/ui";
import ChatContext from "./Chat/Context.js";
