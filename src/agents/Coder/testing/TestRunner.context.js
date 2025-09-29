import TestRunnerExpect from "./TestRunnerExpect.js"

const scenario = {
	onlyFiles: {
		rows: [
			'📦 Running tests for files:', {},
			' - lib/some.test.js', { files: ['lib/some.test.js'], totalFiles: 1 },
			'   --- Total Files: 1 ---   ', {},
			' RUN  v3.2.3 /nanoweb/app', { run: '/nanoweb/app' },
			' ❯ lib/some.test.js (3 tests | 1 failed) 4176ms', { processedFiles: ['lib/some.test.js'], tests: 3, failed: 1, time: 4176 },
			'   ✓ TestRunner > should initialize correctly 1ms', {},
		]
	},
	single: {
		rows: [
			'% node vitest.js lib/functions/TestRunner.test.js ', {},
			'Debugger attached.', {},
			'📦 Running tests for files:', {},
			' - lib/functions/TestRunner.test.js', { files: ['lib/functions/TestRunner.test.js'], totalFiles: 1 },
			'   --- Total Files: 1 ---   ', {},
			' RUN  v3.2.3 /nanoweb/app', { run: '/nanoweb/app' },
			' ❯ lib/functions/TestRunner.test.js (3 tests | 1 failed) 4176ms', { processedFiles: ['lib/functions/TestRunner.test.js'], tests: 3, failed: 1, time: 4176 },
			'   ✓ TestRunner > should initialize correctly 1ms', {},
			'   × TestRunner > should process lines correctly 4169ms', {},
			'     → expected { pass: 3, total: 3, errs: +0, …(4) } to deeply equal { pass: +0, total: +0, errs: +0, …(4) }', {},
			'   ✓ TestRunner > should run tests and handle output 4ms', {},
			'⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯ Failed Tests 1 ⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯', {},
			' FAIL  lib/functions/TestRunner.test.js > TestRunner > should process lines correctly', {},
			'AssertionError: expected { pass: 3, total: 3, errs: +0, …(4) } to deeply equal { pass: +0, total: +0, errs: +0, …(4) }', {},
			' ❯ lib/functions/TestRunner.test.js:68:17', {},
			'     66| ', {},
			"     67|   runner.processLine('Test Files: 1 passed(1)', total)", {},
			'     68|   expect(total).toEqual({ pass: 0, total: 0, errs: 0, files…', {},
			'       |                 ^', {},
			'     69| ', {},
			"     70|   runner.processLine('      Tests  1 failed | 2 passed(3)'…", {},
			'⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯[1/1]⎯', {},
			' Test Files  1 failed (1)', { failedFiles: 1 },
			'      Tests  1 failed | 2 passed (3)', { failed: 1, passed: 2, tests: 3 },
			'   Start at  15:57:43', {},
			'   Duration  5.82s (transform 35ms, setup 0ms, collect 42ms, tests 4.18s, environment 310ms, prepare 124ms)',
			{ duration: { total: 5820, transform: 35, setup: 0, collect: 42, tests: 4180, environment: 310, prepare: 124 } },
		],
	},
	multiple: {
		rows: [
			'📦 Running tests for files:', {},
			' - apps/cli-chat/stories/empty.test.js', { files: ['apps/cli-chat/stories/empty.test.js'], totalFiles: 1 },
			' - apps/core/stories/chatting.test.js', { files: ['apps/core/stories/chatting.test.js'], totalFiles: 2 },
			' - apps/core/stories/empty.test.js', { files: ['apps/core/stories/empty.test.js'], totalFiles: 3 },
			' - apps/core/stories/version.test.js', { files: ['apps/core/stories/version.test.js'], totalFiles: 4 },
			' - src/llm/agents/Agent/Agent.test.js', { files: ['src/llm/agents/Agent/Agent.test.js'], totalFiles: 5 },
			' - src/llm/agents/Coder/Coder.test.js', { files: ['src/llm/agents/Coder/Coder.test.js'], totalFiles: 6 },
			' - src/utils/nano-types/index.test.js', { files: ['src/utils/nano-types/index.test.js'], totalFiles: 7 },
			' - apps/cli/src/chat/Prompt.test.js', { files: ['apps/cli/src/chat/Prompt.test.js'], totalFiles: 8 },
			' - apps/cli/src/components/BooleanPrompt.test.js', { files: ['apps/cli/src/components/BooleanPrompt.test.js'], totalFiles: 9 },
			' - apps/cli/src/components/NumberPrompt.test.js', { files: ['apps/cli/src/components/NumberPrompt.test.js'], totalFiles: 10 },
			' - apps/cli/src/components/SelectPrompt.test.js', { files: ['apps/cli/src/components/SelectPrompt.test.js'], totalFiles: 11 },
			' - apps/cli/src/tests/TestRunner.test.js', { files: ['apps/cli/src/tests/TestRunner.test.js'], totalFiles: 12 },
			' - apps/cli-chat/src/components/MessagesList.test.jsx', { files: ['apps/cli-chat/src/components/MessagesList.test.jsx'], totalFiles: 13 },
			' - apps/core/src/io/ChatMessage.test.js', { files: ['apps/core/src/io/ChatMessage.test.js'], totalFiles: 14 },
			' - apps/cli-chat/src/components/prompts/BooleanPrompt.test.jsx', { files: ['apps/cli-chat/src/components/prompts/BooleanPrompt.test.jsx'], totalFiles: 15 },
			' - apps/cli-chat/src/components/prompts/NumberPrompt.test.jsx', { files: ['apps/cli-chat/src/components/prompts/NumberPrompt.test.jsx'], totalFiles: 16 },
			' - apps/cli-chat/src/components/prompts/Prompt.test.jsx', { files: ['apps/cli-chat/src/components/prompts/Prompt.test.jsx'], totalFiles: 17 },
			' - apps/cli-chat/src/components/prompts/SelectPrompt.test.jsx', { files: ['apps/cli-chat/src/components/prompts/SelectPrompt.test.jsx'], totalFiles: 18 },
			' - apps/cli-chat/src/components/prompts/TextPrompt.test.jsx', { files: ['apps/cli-chat/src/components/prompts/TextPrompt.test.jsx'], totalFiles: 19 },
			' - apps/core/src/models/Chat/Model.test.js', { files: ['apps/core/src/models/Chat/Model.test.js'], totalFiles: 20 },
			' - apps/core/src/models/Chat/Provider.test.js', { files: ['apps/core/src/models/Chat/Provider.test.js'], totalFiles: 21 },
			' - apps/core/src/models/Chat/Usage.test.js', { files: ['apps/core/src/models/Chat/Usage.test.js'], totalFiles: 22 },
			' - apps/core/src/models/Chat/Stream/Choice.test.js', { files: ['apps/core/src/models/Chat/Stream/Choice.test.js'], totalFiles: 23 },
			' - apps/core/src/models/Chat/Stream/Chunk.test.js', { files: ['apps/core/src/models/Chat/Stream/Chunk.test.js'], totalFiles: 24 },
			' - apps/core/src/models/Chat/Stream/EventData.test.js', { files: ['apps/core/src/models/Chat/Stream/EventData.test.js'], totalFiles: 25 },
			'   --- Total Files: 25 ---   ', { totalFiles: 25 },
			' RUN  v2.1.8 /app', { run: '/app' },
			' ❯ src/llm/agents/Agent/Agent.test.js (0)', { processedFiles: ['src/llm/agents/Agent/Agent.test.js'] },
			' ❯ src/llm/agents/Coder/Coder.test.js (0)', { processedFiles: ['src/llm/agents/Coder/Coder.test.js'] },
			' ✓ src/utils/nano-types/index.test.js (32)', { processedFiles: ['src/utils/nano-types/index.test.js'], tests: 32 },
			' ❯ apps/core/src/io/ChatMessage.test.js (5)', { processedFiles: ['apps/core/src/io/ChatMessage.test.js'], tests: 37 },
			' ✓ apps/core/src/models/Chat/Model.test.js (15)', { processedFiles: ['apps/core/src/models/Chat/Model.test.js'], tests: 52 },
			' ✓ apps/core/src/models/Chat/Provider.test.js (2)', { processedFiles: ['apps/core/src/models/Chat/Provider.test.js'], tests: 54 },
			' ✓ apps/core/src/models/Chat/Usage.test.js (3)', { processedFiles: ['apps/core/src/models/Chat/Usage.test.js'], tests: 57 },
			' ✓ apps/core/src/models/Chat/Stream/Choice.test.js (3)', { processedFiles: ['apps/core/src/models/Chat/Stream/Choice.test.js'], tests: 60 },
			' ✓ apps/core/src/models/Chat/Stream/Chunk.test.js (3)', { processedFiles: ['apps/core/src/models/Chat/Stream/Chunk.test.js'], tests: 63 },
			' ✓ apps/core/src/models/Chat/Stream/EventData.test.js (2)', { processedFiles: ['apps/core/src/models/Chat/Stream/EventData.test.js'], tests: 65 },
			' ❯ apps/cli/src/chat/Prompt.test.js (0)', { processedFiles: ['apps/cli/src/chat/Prompt.test.js'], tests: 65 },
			' ❯ apps/cli/src/components/BooleanPrompt.test.js (0)', { processedFiles: ['apps/cli/src/components/BooleanPrompt.test.js'], tests: 65 },
			' ❯ apps/cli/src/components/NumberPrompt.test.js (0)', { processedFiles: ['apps/cli/src/components/NumberPrompt.test.js'], tests: 65 },
			' ❯ apps/cli/src/components/SelectPrompt.test.js (3)', { processedFiles: ['apps/cli/src/components/SelectPrompt.test.js'], tests: 68 },
			'     ↓ submits selected value with keyboard [skipped]', { processedFiles: ['apps/cli/src/components/SelectPrompt.test.js'], tests: 68, skipped: 1 },
			'     ↓ submits selected value with mouse [skipped]', { processedFiles: ['apps/cli/src/components/SelectPrompt.test.js'], tests: 68, skipped: 2 },
			' ❯ apps/cli/src/tests/TestRunner.test.js (5)', { processedFiles: ['apps/cli/src/tests/TestRunner.test.js'], tests: 73 },
			' Test Files  8 failed | 7 passed (15)', { failedFiles: 8, passedFiles: 7, totalFiles: 15 },
			'      Tests  8 failed | 63 passed | 2 skipped (73)', { failed: 8, passed: 63, skipped: 2, tests: 73 },
			'   Start at  01:36:38', {},
			'   Duration  1.32s (transform 493ms, setup 0ms, collect 1.07s, tests 114ms, environment 2ms, prepare 1.04s)',
			{ duration: { total: 1320, transform: 493, setup: 0, collect: 1070, tests: 114, environment: 2, prepare: 1040 } },
		]
	}
}

class ScenarioLine {
	/** @type {string} */
	value
	/** @type {TestRunnerExpect} */
	exp
	/**
	 * @param {object} props
	 * @param {string} props.value
	 * @param {TestRunnerExpect|object} [props.exp={}]
	 * @param {{value: string, exp: TestRunnerExpect}} [props.exp={}]
	 */
	constructor(props = {}) {
		const {
			value = "",
			exp = {},
			prev = {}
		} = props
		this.value = String(value)
		const current = new TestRunnerExpect(prev)
		if (Array.isArray(exp.files)) {
			exp.files.forEach((file) => current.files.push(file))
		}
		for (const [key, val] of Object.entries(exp)) {
			if ("files" === key) continue
			current[key] = val
		}
		this.exp = current
	}
	toString() {
		return [
			String(this.exp),
			this.value
		].join("\n")
	}
}

class Scenario {
	/** @type {ScenarioLine[]} */
	rows
	constructor (props = {}) {
		const {
			rows = []
		} = props
		this.rows = rows
	}
	static fromArray(arr) {
		if (arr.length % 2 === 1) {
			throw new TypeError([
				"Incorrect array of rows",
				"Correct is [value0, options0, value1, options1]"
			].join("\n"))
		}
		const rows = []
		let prev = new TestRunnerExpect()
		for (let i = 0; i < arr.length; i += 2) {
			const line = new ScenarioLine({ value: arr[i], exp: arr[i + 1], prev: { ...prev } })
			prev = line.exp
			rows.push(line)
		}
		return new this({ rows })
	}
}

const onlyFiles = Scenario.fromArray(scenario.onlyFiles.rows)
const single = Scenario.fromArray(scenario.single.rows)
const multiple = Scenario.fromArray(scenario.multiple.rows)

export default {
	onlyFiles,
	single,
	multiple,
}
