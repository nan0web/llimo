import ChatDriver from "../ChatDriver.js"

/**
 * Driver for DeepSeek API
 */
class DeepSeekDriver extends ChatDriver {
	static DEFAULT_MODEL = "deepseek-chat"
	static DEFAULT_ENDPOINT = "https://api.deepseek.com/v1/chat/completions"
}

export default DeepSeekDriver
