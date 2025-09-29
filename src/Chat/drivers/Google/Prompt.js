import Prompt from "../../Prompt.js"

/**
 * Prompt class for Gemini API
 */
class GeminiPrompt extends Prompt {
	/**
	 * Returns string representation
	 * @returns {string} Formatted prompt
	 */
	toString() {
		return [
			`${this.role}:\n${this.content}`,
			...this.getElements([]).map(p => String(p))
		].join("\n\n")
	}
}

export default GeminiPrompt