import ChatAgent from "../Chat/ChatAgent.js"
import ReleaserChatContext from "./ChatContext.js"
import systemMd from "./system.md/index.js"
import ReleaserTask from "./Task.js"

export default class ReleaserAgent extends ChatAgent {
	static SYSTEM_MD = systemMd
	static desc = "Releaser agent for handling release tasks from me.md"

	/**
	 * @param {object} stepResult
	 * @param {ReleaserChatContext} context
	 * @returns {Promise<void>}
	 */
	async updateContextAfterStep(stepResult, context) {
		if (!stepResult.error && stepResult.response) {
			context.setResponse(stepResult.response)
		}
		// Example: subclass update (e.g., process tasks in Release)
		await this.updateTasksFromResponse(stepResult, context)
	}

	/**
	 * Determines if the loop should continue based on tasks status.
	 * @param {object} context - Current context (history, tasks, cancel, loopCount)
	 * @returns {boolean} True if tasks are empty (first run) or there are pending/processing tasks.
	 */
	shouldLoop(context) {
		if (!context.tasks?.length) return true; // Allow first run to load tasks
		return context.tasks.some(task => ["pending", "process"].includes(task.status))
	}

	/**
	 * Updates tasks based on LLM response (e.g., parse completion status)
	 * @param {object} stepResult - {response} from runSingleTurn
	 * @param {ReleaserChatContext} context - Current context (mutable)
	 * @returns {Promise<void>}
	 */
	async updateTasksFromResponse(stepResult, context) {
		if (stepResult.error || !stepResult.response) return

		const { content } = stepResult.response

		// Load initial tasks from me.md if none set
		if (!context.tasks?.length) {
			const meMd = await this.fs.loadDocumentAs(".txt", "me.md", "")
			const releaseMatch = meMd.match(/^#\s*Release\s+(v[\d.]+)/im)
			const id = releaseMatch ? `release-${releaseMatch[1]}` : "release"
			context.tasks = [new ReleaserTask({ id, content: meMd, status: "pending" })]
		}

		// Update based on response
		if (content.includes("completed")) {
			context.tasks = context.tasks.map(task => new ReleaserTask({ ...task, status: "done" }))
		} else {
			context.tasks = context.tasks.map(task => new ReleaserTask({ ...task, status: "process" }))
		}
	}
}
