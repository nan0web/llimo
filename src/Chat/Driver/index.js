import ChatDriver from "./ChatDriver.js"
import CerebrasDriver from "./Cerebras/index.js"
import HuggingFaceDriver from "./HuggingFace/HuggingFaceDriver.js"
import OpenAIDriver from "./OpenAI/OpenAIDriver.js"
import OpenRouterDriver from "./OpenRouter/OpenRouterDriver.js"
import DriverOptions from "./Options.js"

/**
 * Main chat drivers collection
 */
ChatDriver.DRIVERS = {
	CerebrasDriver,
	HuggingFaceDriver,
	OpenAIDriver,
	OpenRouterDriver,
}

export {
	ChatDriver,
	DriverOptions,
}

export default ChatDriver
