import ChatDriver from "../ChatDriver.js"
import Model from "../../Model.js"
import Prompt from "../../Prompt.js"

/**
 * Prompt class for LLaMA API
 */
class QwenPrompt extends Prompt {
	/**
	 * Returns string representation
	 * @param {boolean} [avoidTags=false] - Avoid LLM specific tags, especially for tokenization.
	 * @returns {string} Formatted prompt
	 */
	toString(avoidTags = false) {
		const startTag = avoidTags ? "" : "<|" + "im_start" + "|>"
		const stopTag = avoidTags ? "" : "<|" + "im_end" + "|>"
		return [
			`${startTag}${this.role}\n${this.content}${stopTag}`,
			...this.getElements([]).map(p => String(p))
		].join("\n\n")
	}
}

/**
 * Driver for LLaMA API
 */
class LLaMADriver extends ChatDriver {
	static MODELS = {
		llama: Model.from({
			name: "llama-qwen-coder-2.5",
		})
	}
	static Prompt = QwenPrompt
	static IGNORE_AUTH = true

	/**
	 * Gets request options for API
	 * @param {Prompt|function} prompt Prompt or function
	 * @returns {object} Request options
	 */
	_request(prompt) {
		prompt = this._decodePrompt(prompt)
		return {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				...this._authHeader(),
			},
			body: JSON.stringify({
				prompt: String(prompt),
				stream: true
			})
		}
	}
}

export default LLaMADriver
