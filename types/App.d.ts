export default App;
declare class App extends NanoEvent {
    constructor(props?: {});
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
     * @param {CoderOutputContext} context
     */
    requireSave(chat: ChatMessage, context: CoderOutputContext): Promise<void>;
    /**
     * Asks to run tests [context.tests].
     * @param {ChatMessage} chat
     * @param {CoderOutputContext} context
     */
    requireTest(chat: ChatMessage, context: CoderOutputContext): Promise<void>;
    findConfigs({ uri, configs, allowedExt }: {
        uri?: any;
        configs?: Map<any, any> | undefined;
        allowedExt?: any;
    }): Promise<Map<any, any>>;
    loadConfig(uri?: any, configs?: Map<any, any>): Promise<{}>;
    loadConfigFile(uri: any): Promise<any>;
}
import NanoEvent from "@yaro.page/nano-events";
import ChatProvider from "./Chat/Provider.js";
import ChatModel from "./Chat/Model.js";
import ChatMessage from "./Chat/Message.js";
import DB from "@nan0web/db";
import CoderOutputContext from "./agents/Coder/OutputContext.js";
