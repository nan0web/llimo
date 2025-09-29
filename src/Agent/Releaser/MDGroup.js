import { MDHeading2 } from "@nan0web/markdown"

export default class MDGroup extends MDHeading2 {
	/**
	 * @param {any} input
	 * @returns {MDGroup}
	 */
	static from(input) {
		if (input instanceof MDGroup) return input
		if (input instanceof MDHeading2) {
			return new MDGroup({ content: input.content })
		}
		return new MDGroup(input)
	}
	toString() {
		return `## ${this.content}`
	}
}