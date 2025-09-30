import ChatMessage from "../Chat/Message.js"
import ChatResponse from "../Chat/Response.js"

export default class SystemMdRules {
	constructor(input = {}) {
		const {
			console: initialConsole = console
		} = input
		this.console = initialConsole
	}
	/**
	 * @param {ChatMessage} message
	 * @returns {Promise<boolean>}
	 */
	async validateInput(message) {
		return true
	}
	/**
	 * @param {ChatResponse} response
	 * @returns {Promise<boolean>}
	 */
	async validateResponse(response) {
		return true
	}
	toString() {
		return ""
	}
}