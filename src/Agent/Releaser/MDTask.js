import { MDHeading3 } from '@nan0web/markdown'

export default class MDTask extends MDHeading3 {
	id = ""
	content = ""

	constructor(input) {
		super(input)
		const { id = this.id, content = this.content } = input
		this.id = String(id)
		this.content = String(content)
	}

	/**
	 * @param {any} input
	 * @returns {MDTask}
	 */
	static from(input) {
		if (input instanceof MDTask) return input
		if (typeof input === 'string') {
			const id = input.toLowerCase().replace(/\s+/g, '-')
			return new MDTask({ content: input, id })
		}
		if (input instanceof MDHeading3) {
			const id = input.content.toLowerCase().replace(/\s+/g, '-')
			return new MDTask({ content: input.content, id })
		}
		return new MDTask(input)
	}

	toString() {
		return `### ${this.content}`
	}

	toJSON() {
		return {
			id: this.id,
			content: this.content,
		}
	}
}
