import Response from "../../Response.js"
import GeminiUsage from "./Usage.js"

/**
 * Response class for Gemini API
 */
class GeminiResponse extends Response {
	static PROPERTIES = {
		...Response.PROPERTIES,
		usage: GeminiUsage,
	}
	static ALIASES = {
		responseId: "response_id",
		finishReason: "finish_reason",
		usageMetadata: "usage",
		modelVersion: "model"
	}
	
	/**
	 * Returns string representation
	 * @returns {string} Formatted response
	 */
	toString() {
		return [
			`${this.role}:\n${this.content}`,
			...this.getElements([]).map(p => String(p))
		].join("\n\n")
	}
}

export default GeminiResponse