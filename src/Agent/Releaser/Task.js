import { Enum } from "@nan0web/types"

export default class ReleaserTask {
	static STATUSES = {
		pending: "pending",
		process: "process",
		done: "done"
	}

	status = ReleaserTask.STATUSES.pending

	constructor(input) {
		const {
			id = "",
			desc = "",
			status = this.status,
		} = input
		this.id = String(id)
		this.desc = String(desc)
		this.status = Enum(...Object.values(this.constructor.STATUSES))(status)
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
			desc: this.desc,
			status: this.status,
		}
	}
}