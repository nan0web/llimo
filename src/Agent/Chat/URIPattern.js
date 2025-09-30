import micromatch from "micromatch"

class URIPattern {
	/** @type {string} */
	uri

	/**
	 * Creates a new URIPattern instance
	 * @param {string} input - The URI pattern string
	 */
	constructor(input) {
		this.uri = String(input)
	}

	/**
	 * Checks if the URI is remote (contains a scheme like http:// or https://)
	 * @returns {boolean} - True if URI is remote, false otherwise
	 */
	get isRemote() {
		return 2 === this.uri.split("://").length || 2 === this.uri.split("//").length
	}

	/**
	 * Checks if the URI is local (not remote)
	 * @returns {boolean} - True if URI is local, false otherwise
	 */
	get isLocal() {
		return !this.isRemote
	}

	/**
	 * Checks if the URI contains pattern matching characters (*, ?, [, {, !, +, [at])
	 * @returns {boolean} - True if URI is a pattern, false otherwise
	 */
	get isPattern() {
		if (!this.uri.includes('*') && !this.uri.includes('?') && !this.uri.includes('[') && !this.uri.includes('{') && !this.uri.includes('!') && !this.uri.includes('+') && !this.uri.includes('@')) {
			return false
		}
		try {
			micromatch([], this.uri)
			return true
		} catch (e) {
			return false
		}
	}

	/**
	 * Gets the static prefix of the URI (everything before the first pattern character)
	 * @returns {string} - The static prefix string
	 */
	get staticPrefix() {
		const str = String(this.uri)
		if (!this.isPattern) return str
		// Detect where magic starts (first * ? [ { etc.)
		const match = str.match(/[*?\[{\}!+@]/)
		if (match) {
			return str.slice(0, match.index).trim()
		}
		return str
	}

	/**
	 * Filters an array of strings using micromatch against the URI pattern
	 * @param {string[]} arr - An array of URI strings to filter
	 * @returns {string[]} - Filtered array of matching URIs
	 */
	filter(arr = []) {
		const uri = this.uri.startsWith("./") ? this.uri.slice(2) : this.uri
		const clean = arr.map(a => a.startsWith("./") ? a.slice(2) : a)
		const result = micromatch(clean, uri)
		const affix = uri.endsWith("/") ? "/" : ""
		const nested = clean.filter(a => a.startsWith(uri)).filter(
			a => String(affix + a.slice(uri.length)).startsWith("/")
		)
		return Array.from(new Set([...result, ...nested]))
	}
}

export default URIPattern
