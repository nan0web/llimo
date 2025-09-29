class TestRunnerSection {
	static COLLECTING_FILES = "📦 Running tests for files:"
	static RUNNING_TESTS = /^ RUN  v/
	static FAILED_TESTS = /⎯⎯ Failed Tests \d+ ⎯⎯/
	static RESULTS = /^ Test Files /
	/** @type {string|RegExp} */
	active
	/** @type {string|RegExp[]} */
	line
	/** @type {string[]} */
	content
	/**
	 * @param {object} props
	 * @param {string|RegExp} props.active
	 * @param {string} props.line
	 */
	constructor(props = {}) {
		const { active, line, content = [] } = props
		this.active = active
		this.line = String(line || "")
		this.content = content || []
	}
	toString() {
		return this.line
	}
	static parse(line) {
		const available = [
			TestRunnerSection.COLLECTING_FILES,
			TestRunnerSection.RUNNING_TESTS,
			TestRunnerSection.FAILED_TESTS,
			TestRunnerSection.RESULTS,
		]
		const section = available.find(active => typeof active === "string" ? active === line : active.test(line))
		if (section) {
			return new this({ active: section, line })
		}
		return null
	}
	static parseAll(lines) {
		const sections = []
		let content = []
		lines.forEach(line => {
			const section = this.parse(line)
			if (section) {
				if (sections.length > 0) {
					sections[sections.length - 1].content = content
					content = []
				}
				sections.push(section)
			}
			if (section || sections.length) {
				content.push(line)
			}
		})
		if (sections.length > 0 && content.length > 0) {
			sections[sections.length - 1].content = content
		}
		return sections
	}
}

export default TestRunnerSection
