import { equal, match } from "@nan0web/types"
import VitestLogDuration from "./VitestLogDuration.js"
import TestRunnerSection from "./TestRunnerSection.js"

class TestRunnerExpect {
	/** @type {string[]} */
	files
	/** @type {number} */
	totalFiles
	/** @type {string} */
	run
	/** @type {number} */
	tests
	/** @type {number} */
	skipped
	/** @type {number} */
	time
	/** @type {number} */
	passedFiles
	/** @type {number} */
	failedFiles
	/** @type {number} */
	skippedFiles
	/** @type {number} */
	passed
	/** @type {number} */
	failed
	/** @type {number} */
	total
	/** @type {VitestLogDuration} */
	duration
	/** @type {string[]} */
	processedFiles
	/**
	 *
	 * @param {object} props
	 * @param {string[]} props.files
	 * @param {number} props.totalFiles
	 * @param {string} props.run
	 * @param {number} props.tests
	 * @param {number} props.skipped
	 * @param {number} props.time
	 * @param {number} props.passedFiles
	 * @param {number} props.failedFiles
	 * @param {number} props.skippedFiles
	 * @param {number} props.passed
	 * @param {number} props.failed
	 * @param {number} props.total
	 * @param {VitestLogDuration} props.duration
	 */
	constructor(props = {}) {
		const {
			files = [],
			totalFiles = 0,
			run = "",
			tests = 0,
			skipped = 0,
			time = 0,
			passedFiles = 0,
			failedFiles = 0,
			skippedFiles = 0,
			passed = 0,
			failed = 0,
			total = 0,
			duration = new VitestLogDuration(),
			processedFiles = [],
		} = props
		this.files = files.slice()
		this.totalFiles = Number(totalFiles)
		this.run = String(run)
		this.tests = Number(tests)
		this.skipped = Number(skipped)
		this.time = Number(time)
		this.passedFiles = Number(passedFiles)
		this.failedFiles = Number(failedFiles)
		this.skippedFiles = Number(skippedFiles)
		this.passed = Number(passed)
		this.failed = Number(failed)
		this.total = Number(total)
		this.duration = duration
		this.processedFiles = processedFiles.slice()
	}
	toString() {
		return [
			`(${this.run})`,
			`${this.time} ms`,
			`${this.files.length} F`,
			`${this.totalFiles} TF`,
			`${this.passedFiles} PF`,
			`${this.failedFiles} FF`,
			`${this.skippedFiles} SF`,
			`${this.processedFiles.length} RF`,
			`${this.tests} •`,
			`${this.skipped} ↓`,
			`${this.failed} -`,
			`${this.passed} +`,
			`${this.total} •`,
		].join(", ")
	}
	/**
	 * Show the difference between two TestRunnerExpect objects.
	 * @param {TestRunnerExpect} other - The other TestRunnerExpect object to compare.
	 * @returns {object} - The difference between the two objects.
	 */
	diff(other) {
		const diff = {}
		for (const key in this) {
			if (equal(this[key], other[key])) continue
			diff[key] = [this[key], other[key]]
		}
		return diff
	}
	static parseSections(sections = []) {
		const total = new TestRunnerExpect()
		const parseNums = (str, total, suffix = "") => {
			let count
			if (str.includes("(")) {
				count = Number(String(str.split("(")[1]).replace(")", ""))
				str = str.split("(")[0].trim()
			}
			const arr = str.split('|').map(s => s.trim())
			arr.forEach((s) => {
				const [value, key] = s.split(' ')
				if (key === 'tests') total[`tests${suffix}`] += parseInt(value)
				if (key === 'failed') total[`failed${suffix}`] += parseInt(value)
				if (key === 'passed') total[`passed${suffix}`] += parseInt(value)
				if (key === 'skipped') total[`skipped${suffix}`] += parseInt(value)
			})
			if (count) {
				total[`tests${suffix}`] = count
			}
			return arr
		}
		for (const section of sections) {
			if (section.active === TestRunnerSection.COLLECTING_FILES) {
				section.content.forEach(line => {
					if (line.startsWith(" - ")) {
						total.files.push(line.slice(3).trim())
					}
				})
				total.totalFiles = total.files.length
			}
			if (section.active === TestRunnerSection.RUNNING_TESTS) {
				let line = section.content.shift()
				total.run = line.split(" RUN  v")[1].split(" ").pop()
				line = section.content.shift()
				while (line && !match(TestRunnerSection.FAILED_TESTS)(line)) {
					if (line.startsWith(" ❯ ")) {
						// " ❯ lib/functions/TestRunner.test.js (3 tests | 1 failed) 4176ms"
						const [file_, str_] = line.split('(')
						total.processedFiles.push(file_.slice(3).trim())
						let [str, time] = String(str_).split(')')
						if (time) {
							const multiplier = time.endsWith("ms") ? 1 : 1000
							total.time += parseFloat(time.trim().replace(/[ms]+$/, '')) * multiplier
						}
						if (!isNaN(str)) {
							str = parseInt(str) + " tests"
						}
						parseNums(str, total)
					}
					else if (line.startsWith(" ✓ ") || line.startsWith(" × ")) {
						const isFailed = line.startsWith(" × ")
						const [file_, str_] = String(line.split(isFailed ? " × " : " ✓ ")[1]).split("(")
						total.processedFiles.push(file_.trim())
						let [str, time] = String(str_).split(')')
						if (!isNaN(str)) {
							str = parseInt(str) + " tests"
						}
						parseNums(str, total)
						if (time) {
							const multiplier = time.endsWith("ms") ? 1 : 1000
							total.time += parseFloat(time.trim().replace(/[ms]+$/, '')) * multiplier
						}
					}
					else if (line.endsWith("[skipped]")) {
						++total.skipped
					}
					line = section.content.shift()
				}
			}
			if (section.active === TestRunnerSection.RESULTS) {
				const [files, tests, start, duration] = section.content
				if (files) {
					const str = files.split("Test Files")[1].trim()
					let [statusPart, countPart] = str.split("(")
					countPart = (countPart || "").replace(")", "").trim()
					parseNums(statusPart, total, "Files")
					if (countPart) total.totalFiles = parseInt(countPart)
				}
				if (tests) {
					total.tests = 0
					total.failed = 0
					total.passed = 0
					total.skipped = 0
						const str = tests.split("Tests")[1].trim()
					parseNums(str, total)
				}
				if (start) {
					// ignore start time
				}
				if (duration) {
					total.duration = VitestLogDuration.parse(duration)
				}
			}
		}
		total.files = total.files.sort()
		total.processedFiles = total.processedFiles.sort()
		return total
	}
	static from(props) {
		if (props instanceof TestRunnerExpect) return props
		return new this(props)
	}
}

export default TestRunnerExpect
