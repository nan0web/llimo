import ChatAgent from "../Chat/ChatAgent.js"
import ReleaserChatContext from "./ChatContext.js"
import ReleaserTask from "./Task.js"
import ChatMessage from "../../Chat/Message.js"

export default class ReleaserAgent extends ChatAgent {
	static desc = "Releaser agent for handling release tasks from me.md"

	/**
	 * @param {object} stepResult
	 * @param {ReleaserChatContext} context
	 * @returns {Promise<void>}
	 */
	async updateTasksFromResponse(stepResult, context) {
		if (stepResult.error || !stepResult.response) return

		const { content } = stepResult.response

		// Load initial tasks from me.md if none set
		if (!context.tasks?.length) {
			await this.requireFS()
			const meMd = await this.fs.loadDocumentAs(".txt", "me.md", "")
			// Split string into array if it's a string
			const taskLines = Array.isArray(meMd) ? meMd : meMd.split('\n').filter(Boolean)
			context.tasks = taskLines.map((line, index) => ReleaserTask.from({
				id: `task-${index}`,
				desc: line.trim(),
				status: "pending"
			}))
		}

		// Update based on response
		if (content.includes("completed")) {
			context.tasks = context.tasks.map(task => new ReleaserTask({ ...task, status: "done" }))
		} else {
			context.tasks = context.tasks.map(task => new ReleaserTask({ ...task, status: "process" }))
		}
	}

	/**
	 * Creates initial chat (system + configs).
	 * @returns {Promise<ChatMessage>}
	 */
	async createChat() {
		await this.requireFS()
		const content = await this.fs.loadDocumentAs(".txt", "system.md", this.SYSTEM_MD)
		return new ChatMessage({ role: ChatMessage.ROLES.system, content })
	}
}
