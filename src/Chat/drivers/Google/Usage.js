import Usage from "../../Usage.js"

/**
 * Usage data from Gemini response
 */
class GeminiUsage extends Usage {
	static PROPERTIES = {
		...Usage.PROPERTIES,
		thoughts_tokens: Number,
	}
	static ALIASES = {
		promptTokenCount: "prompt_tokens",
		candidatesTokenCount: "completion_tokens",
		totalTokenCount: "total_tokens",
		thoughtsTokenCount: "thoughts_tokens",
	}
	
	/**
	 * Gets output tokens count including thoughts
	 * @returns {number} Total output tokens
	 */
	get tokensOut() {
		return Number(this.completion_tokens) + Number(this.thoughts_tokens)
	}
}

export default GeminiUsage