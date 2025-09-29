import ChatResponse from "../../../../Chat/Response.js"
import SystemMdRules from "../../../SystemMdRules.js"

export default class ReleaserFormatRules extends SystemMdRules {
	/**
	 * @param {ChatResponse} response
	 */
	async validateResponse(response) {
		try {
			String(response.content).split("\n").map(s => JSON.parse(s))
			return true
		} catch (/** @type {any} */ err) {
			this.console.warn(err.message)
			if (err.stack) this.console.debug(err.stack)
			return false
		}
	}
	toString() {
		return `## Формат комунікації
Всі відповіді мають повертатись лише у JSONL форматі: [{ file: string, content: string }, ...].
file - локальний шлях до файла (file: "src/README.md.js", content: "export ...") або команда, якщо починається з : (file: ":bash", content: "ls .")
`
	}
}
