import Markdown, { InterceptorInput, MDHeading1, MDList } from "@nan0web/markdown"
import ChatMessage from "../../../../Chat/Message.js"
import SystemMdRules from "../../../SystemMdRules.js"

export default class ReleaserTaskRules extends SystemMdRules {
	/**
	 * Validates that the input message follows Release format that must include
	 *
	 * @param {ChatMessage} message
	 * @returns {Promise<boolean>}
	 */
	async validateInput(message) {
		const md = new Markdown()
		md.parse(message.content)
		const flat = md.document.flat()
		const ok = flat.some(el => el instanceof MDHeading1 && el.content.startsWith("Release"))
		if (!ok) {
			this.console.warn("Input must contain '# Release' to start a release process")
		}
		return ok
	}

	toString() {
		return `## Завдання
Всі відповіді мають бути присвячені завданням з першого повідомлення релізу.
Повідомлення має містити вказівки для кожного пункту завдання.
`
	}
}