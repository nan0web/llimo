import ChatContext from "../../Chat/Context.js"
import ChatResponse from "../../Chat/Response.js"
import ReleaserTask from "./Task.js"

export default class ReleaserChatContext extends ChatContext {
	/** @type {ReleaserTask[]} */
	tasks = []

	constructor(input) {
		super(input)
		const {
			tasks = this.tasks
		} = input
		this.tasks = tasks.map(t => ReleaserTask.from(t))
	}

	/**
	 * Sets prevResponse
	 * @param {ChatResponse} response
	 */
	setResponse(response) {
		this.prevResponse = response
	}
	
	toJSON() {
		return {
			tasks: this.tasks.map(t => t.toJSON ? t.toJSON() : t ),
		}
	}
}