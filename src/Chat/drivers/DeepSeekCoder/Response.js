import Response from "../../Response.js"
import Usage from "../../Usage.js"

/**
 * Response class for DeepSeek Coder
 */
class DeepSeekCoderResponse extends Response {
	static PROPERTIES = {
		...Response.PROPERTIES,
		usage: Usage
	}
	static ALIASES = {
		responseId: "response_id",
		finishReason: "finish_reason"
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

export default DeepSeekCoderResponse