import { Enum } from "@nan0web/types"
import MDTask from "./MDTask.js"

export default class ReleaserTask extends MDTask {
	static STATUSES = {
		pending: "pending",
		process: "process",
		done: "done"
	}

	status = ReleaserTask.STATUSES.pending

	constructor(input) {
		super(input)
		const {
			status = this.status,
		} = input
		this.status = Enum(...Object.values(this.STATUSES))(status)
	}

	/** @returns {Record<string, string>} */
	get STATUSES() {
		return /** @type {typeof ReleaserTask} */(this.constructor).STATUSES
	}

	get isDone() {
		return this.status === this.STATUSES.done
	}

	/**
	 * @param {any} input
	 * @returns {ReleaserTask}
	 */
	static from(input) {
		if (input instanceof ReleaserTask) return input
		return new ReleaserTask(input)
	}

	toJSON() {
		return {
			id: this.id,
			content: this.content,
			status: this.status,
		}
	}
}
