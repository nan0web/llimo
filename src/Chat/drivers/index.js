import ChatDriver from "./ChatDriver.js"
import OpenAIDriver from "./OpenAI/OpenAIDriver.js"
import DeepSeekDriver from "./DeepSeek/DeepSeekDriver.js"
import GeminiDriver from "./Google/GeminiDriver.js"
import GrokDriver from "./X/GrokDriver.js"
import LLaMaDriver from "./Meta/LLaMaDriver.js"
import HuggingFaceDriver from "./HuggingFace/HuggingFaceDriver.js"

/**
 * Main chat drivers collection
 */
ChatDriver.DRIVERS = {
	OpenAIDriver,
	DeepSeekDriver,
	GeminiDriver,
	GrokDriver,
	LLaMaDriver,
	HuggingFaceDriver,
}

export default ChatDriver
