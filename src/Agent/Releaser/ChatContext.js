import ChatContext from "../../Chat/Context.js"
import Response from "../../Chat/Response.js"
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
	 * @param {Response} response
	 */
	setResponse(response) {
		this.chat.add(response)
		this.prevResponse = response
	}

	toJSON() {
		return {
			...this,
			tasks: this.tasks.map(t => t.toJSON())
		}
	}
}
