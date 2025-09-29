import ChatDriver from "./ChatDriver.js"
import OpenRouterDriver from "./OpenRouter.js"

class ChatDrivers {
	static Base = ChatDriver
	static Chat = ChatDriver
	static OpenRouter = OpenRouterDriver

	/**
	 * Returns the requested chat driver instance created with the provided options.
	 * @param {string} name
	 * @param {import("openai").ClientOptions} options
	 * @returns {ChatDriver}
	 */
	static create(name, options = {}) {
		/** @type {typeof ChatDriver} */
		const Driver = this[name]
		if (!Driver) {
			throw new Error(["Driver with provided name not found", name].join(": "))
		}
		const driver = new Driver(options)
		return driver
	}
}

export {
	ChatDriver,
	OpenRouterDriver,
}

export default ChatDrivers
