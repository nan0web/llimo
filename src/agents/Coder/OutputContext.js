import OutputContext from "../Agent/OutputContext.js"

class CoderOutputContext extends OutputContext {
	/** @type {string} */
	cwd
	/** @type {Array<{file: string, content: string}>} */
	files
	/** @type {Array<value: any, command: string, content: string, type: string>} */
	commands
	/** @type {string[]} */
	tests
	/**
	 * @param {object} props
	 * @param {string} props.cwd
	 * @param {Array<{file: string, content: string}>} props.files
	 * @param {Array<{value: any, command: string, content: string, type: string}>} props.commands
	 * @param {string[]} props.tests
	 */
	constructor(props = {}) {
		super(props)
		const {
			cwd = ".",
			files = [],
			commands = [],
			tests = [],
		} = props
		this.cwd = cwd
		this.files = files
		this.commands = commands
		this.tests = tests
	}
	toString() {
		const spaces = " ".repeat("commands[] = ".length)
		return [
			`cwd        = ${this.cwd}`,
			`files[]    = ${this.files.map(f => f.file).join("\n" + spaces)}`,
			`commands[] = ${this.commands.map(c => c.command).join("\n" + spaces)}`,
			`tests[]    = ${this.tests.join("\n" + spaces)}`
		].join("\n")
	}
}

export default CoderOutputContext
