import Markdown, { MDElement, MDHeading1, MDHeading2, MDHeading3 } from "@nan0web/markdown"
import MDRelease from "./MDRelease.js"
import MDGroup from "./MDGroup.js"
import MDTask from "./MDTask.js"

export default class ReleaserDocument extends Markdown {
	#release
	#notes = []
	#groups = []
	#tasks = []

	constructor(input) {
		super(input)
	}

	get release() {
		return this.#release
	}

	get notes() {
		return this.#notes
	}

	get groups() {
		return this.#groups
	}

	get tasks() {
		return this.#tasks
	}

	/**
	 * Heading1 with the version:
	 * # MVP release - v0.1.0
	 * { name: "MVP release", major: "0", minor: "1", patch: "0", version: "v0.1.0" }
	 *
	 * Heading2 with the task group and following content as children
	 * ## Agents
	 * { content: "Agents" }
	 *
	 * Heading3 with the task name and following content as children
	 * ### Releaser agent
	 * { content: "Releaser agent" }
	 *
	 * @param {string} text
	 * @returns {MDElement[]}
	 */
	parse(text) {
		const elements = super.parse(text)
		let currentGroup, currentTask
		this.#groups = []
		this.#tasks = []
		this.#notes = []

		for (const el of elements) {
			if (el instanceof MDHeading1) {
				this.#release = MDRelease.from(el)
				currentGroup = null
				currentTask = null
			}
			else if (el instanceof MDHeading2) {
				currentGroup = MDGroup.from(el)
				this.#groups.push(currentGroup)
				currentTask = null
			}
			else if (el instanceof MDHeading3) {
				currentTask = MDTask.from(el)
				currentGroup?.add(currentTask)
				this.#tasks.push(currentTask)
			}
			else if (el instanceof MDElement) {
				if (currentTask) {
					currentTask.add(el)
				}
				else if (currentGroup) {
					currentGroup.add(el)
				}
				else {
					this.#notes.push(el)
				}
			}
		}
		return []
	}

	toString() {
		const releaseStr = this.#release ? `${this.#release.toString()}\n` : ''
		const notesStr = this.#notes.map(n => n.toString()).join('\n\n') + (this.#notes.length ? '\n\n' : '')
		const groupsStr = this.#groups.map(group => {
			const header = group.toString()
			const childrenStr = group.children.map(child => {
				if (child instanceof MDTask) {
					const taskHeader = child.toString()
					const taskChildren = child.children.map(c => c.toString()).join('\n\n')
					return `${taskHeader}\n\n${taskChildren}`
				} else {
					return child.toString()
				}
			}).join('\n\n')
			return `${header}\n\n${childrenStr}`
		}).join('\n\n')
		return [releaseStr, notesStr, groupsStr].filter(Boolean).join('').trim()
	}

	/**
	 *
	 * @param {any} input
	 * @returns {ReleaserDocument}
	 */
	static from(input) {
		if (input instanceof ReleaserDocument) return input
		if ("string" === typeof input) {
			const md = new ReleaserDocument()
			md.parse(input)
			return md
		}
		return new ReleaserDocument(input)
	}
}