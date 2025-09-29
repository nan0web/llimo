import OpenAI from "openai"

class ChatDriver extends OpenAI {
	/** @param {import("openai").ClientOptions} [options] */
	constructor(options = {}) {
		options.defaultHeaders = {
			"HTTP-Referer": "https://nan0web.yaro.page",
			"X-Title": "nan0web",
		}
		super(options)
	}
}

export default ChatDriver
