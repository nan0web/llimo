export default ChatDrivers;
import ChatDriver from "./ChatDriver.js";
import OpenRouterDriver from "./OpenRouter.js";
declare class ChatDrivers {
    static Base: typeof ChatDriver;
    static Chat: typeof ChatDriver;
    static OpenRouter: typeof OpenRouterDriver;
    /**
     * Returns the requested chat driver instance created with the provided options.
     * @param {string} name
     * @param {import("openai").ClientOptions} options
     * @returns {ChatDriver}
     */
    static create(name: string, options?: import("openai").ClientOptions): ChatDriver;
}
export { ChatDriver, OpenRouterDriver };
