import NanoEvent from '@yaro.page/nano-events'
import { spawn } from 'node:child_process'
import TestRunnerExpect from './TestRunnerExpect.js'
import TestRunnerSection from './TestRunnerSection.js'

class TestError extends Error {
	stats
	stderr
	stdout
	constructor(message, options) {
		const { stats, stderr, stdout } = options
		super(message, options)
		this.stats = stats
		this.stderr = stderr
		this.stdout = stdout
	}
}

/**
 * TestRunner class for running tests and handling test results.
 */
class TestRunner extends NanoEvent {
	static FAILED_TESTS_HEADER = "⎯⎯⎯ Failed Tests"
	static TOTAL_FILES_HEADER = "   --- Total Files: "
	static FAILED_TESTS_END = /⎯\[(\d+)\/(\d+)\]⎯$/

	static Section = TestRunnerSection

	command = "pnpm"
	/**
	 * @param {string} cwd - The current working directory.
	 */
	constructor(cwd) {
		super()
		this.cwd = cwd
		this.stdout = []
		this.stderr = []
	}

	/**
	 * Processes each line of the test output.
	 * @param {object} props
	 * @param {number} props.index - The line of output.
	 * @param {TestRunnerExpect} props.total - The total test results.
	 * @param {string[]} props.lines - The array of lines.
	 */
	processLine({ index, total: initialTotal, lines = [] }) {
		const prevs = lines.slice(0, index + 1)
		// const sections = prevs.map((line, index) => Section.parse(line)).filter(Boolean)
		const sections = TestRunnerSection.parseAll(prevs)
		const total = TestRunnerExpect.parseSections(sections)
		Object.assign(initialTotal, total)
		return total
	}

	/**
	 * Runs the test command and handles the output.
	 * @param {string[]} args - The arguments for the test command.
	 * @param {string} testCommand - The test command to run.
	 * @returns {Promise<object>} - The total test results.
	 */
	run(args = ['test'], testCommand = this.command) {
		const testArgs = args
		const total = new TestRunnerExpect()
		let isRunning = true
		this.stdout = []
		this.stderr = []

		this.emit("start", {})

		const testProcess = spawn(testCommand, testArgs, { cwd: this.cwd, stdio: 'pipe' })

		testProcess.stdout.on('data', (data) => {
			const lines = data.toString().split('\n').map(s => s.trim()).filter(line => line !== '')
			lines.forEach((line, index) => {
				this.stdout.push(line)
				this.processLine({ line, index, total, lines })
				this.emit("data", { ...total, line })
			})
		})

		testProcess.stderr.on('data', (data) => {
			const lines = data.toString().split('\n')
			lines.forEach((line, index) => {
				this.stderr.push(line)
				this.processLine({ line, index, total, lines })
				this.emit("error", { ...total, line })
			})
		})

		testProcess.on('close', (code) => {
			isRunning = false
			this.emit("end", { ...total, code, stderr: this.stderr, stdout: this.stdout })
		})

		testProcess.on('error', (error) => {
			isRunning = false
			this.emit("error", error)
		})

		return new Promise((resolve, reject) => {
			testProcess.on('close', (code) => {
				if (code === 0) {
					resolve(total)
				} else {
					reject(
						new TestError(
							"Some errors happend",
							{ stats: total, stderr: this.stderr, stdout: this.stdout }
						)
					)
				}
			})
		})
	}
}

export default TestRunner
