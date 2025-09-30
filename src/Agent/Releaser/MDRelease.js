import { MDHeading1 } from "@nan0web/markdown"

export default class MDRelease extends MDHeading1 {
	name
	major
	minor
	patch
	constructor(input = {}) {
		super(input)
		const {
			name = "",
			major = "",
			minor = "",
			patch = "",
		} = input
		this.name = name
		this.major = major
		this.minor = minor
		this.patch = patch
	}
	get version() {
		return `v${this.major}.${this.minor}.${this.patch}`
	}
	toString() {
		return [this.name, this.version].join(" - ")
	}
	/**
	 * @param {any} input
	 * @returns {MDRelease}
	 */
	static from(input) {
		if (input instanceof MDRelease) return input
		if (input instanceof MDHeading1) {
			return this.parse(input.content)
		}
		return new MDRelease(input)
	}
	/**
	 * Parses the string of the heading with the version in a format {name} - {vX.Y.Z}
	 * @param {string} str
	 */
	static parse(str) {
		const [name, version = ""] = String(str).split(" - ")
		const found = version.trim().match(/v(\d+)\.(\d+)\.(\d+)/)
		if (!found) {
			throw new TypeError("Release version must be provided in a format: {name} - {vX.Y.Z}")
		}
		return new MDRelease({
			name,
			major: found[1],
			minor: found[2],
			patch: found[3],
		})
	}
}