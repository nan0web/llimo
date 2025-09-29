import DB from "@nan0web/db"

export default class CurrencyCalculatorRelease {
	/**
	 * Creates a scenario for releasing a currency calculator feature.
	 * Simulates at least 6 steps including planning, implementation, testing,
	 * error handling, and release summary.
	 * @returns {Array<{step: number, db: DB, description: string}>}
	 */
	static async create() {
		const root = new DB({
			predefined: [
				// Step 1: Planning the release with me.md and system.md
				["1/me.md", `# Release Currency Calculator - v1.0.0
## Atoms
### CLI Interface
Create a console interface for currency conversion.
- [ ] Implement \`convert(amount, from, to)\`
- [ ] Add input validation

### Exchange Rates Model
Implement exchange rate fetching and storage.
- [ ] Fetch rates via external API
- [ ] Cache rates locally for offline use

## Molecules
### Console App
Integrate components into a working CLI app.
- [ ] Combine CLI and model
- [ ] Add basic help flag

## Tests
- [ ] Unit tests for conversion logic
- [ ] Integration test for CLI commands
- [ ] Mock API test for offline mode`],

				["1/system.md", `# System Instructions
You are an agent tasked with releasing a currency calculator CLI app.

Steps:
1. Read and parse \`me.md\` for tasks.
2. Implement one task at a time.
3. After each implementation, you must write tests.
4. Run all current tests. If failed:
   - Review error logs
   - Fix code or tests
   - Re-run tests
5. Once all tasks in me.md are complete, draft a changelog.
6. Finalize commit message and release summary.`],

				// Step 2: Initiating the release
				["2/chat/chat.md", `# user: Start release of currency calculator v1.0.0`],
				["2/chat/prompt.md", ``],
				["2/response.md", `# assistant: Reading tasks from me.md...
Starting task 1: CLI Interface implementation.`],

				// Step 3: Begin implementing CLI logic and tests
				["3/src/cli.js", `#!/usr/bin/env node
import { convert } from './exchange.js'

function run(args) {
  if (args.length < 3) {
    console.log("Usage: calc-currency <amount> <from> <to>")
    process.exit(1)
  }

  const [amount, from, to] = args
  const result = convert(parseFloat(amount), from.toUpperCase(), to.toUpperCase())
  console.log(result)
}`],

				["3/src/exchange.js", `const rates = {
  USD: 1,
  EUR: 0.93,
  UAH: 36.9
}

export function convert(amount, from, to) {
  if (rates[from] === undefined || rates[to] === undefined) {
    return "Invalid currency code"
  }

  const inUSD = amount / rates[from]
  return (inUSD * rates[to]).toFixed(2)
}`],

				["3/response.md", `# assistant: CLI interface and basic exchange model created.
Now testing conversion and CLI parsing.`],

				["3/test/unit/exchange.test.js", `import { test } from 'node:test'
import { strict as assert } from 'node:assert'
import { convert } from '../../src/exchange.js'

test("exchange conversion works for USD to EUR", () => {
  assert.equal(convert(100, "USD", "EUR"), "93.00")
})

test("exchange handles unknown currency", () => {
  assert.equal(convert(100, "USD", "XYZ"), "Invalid currency code")
})`],

				["3/test/integration/cli.test.js", `import { test } from 'node:test'
import { spawn } from 'node:child_process'

test("cli shows usage when no args", (t, done) => {
  const cli = spawn('node', ['./src/cli.js'])
  let output = ""
  cli.stdout.on('data', (data) => {
    output += data.toString()
  })
  cli.on('close', () => {
    assert.ok(output.includes("Usage"))
    done()
  })
})`],

				// Step 4: Error simulation in tests
				["4/test-results.log", ` FAIL  test/unit/exchange.test.js
  ● exchange conversion works for USD to EUR
    Expected: "93.00"
    Received: "93"`],

				["4/response.md", `# assistant: Test failure in exchange conversion.
Fixing CLI output to ensure fixed decimal.`],

				// Step 5: Apply fix
				["5/src/exchange.js", `const rates = {
  USD: 1,
  EUR: 0.93,
  UAH: 36.9
}

export function convert(amount, from, to) {
  if (rates[from] === undefined || rates[to] === undefined) {
    return "Invalid currency code"
  }

  const inUSD = amount / rates[from]
  const result = inUSD * rates[to]
  return Number(result.toFixed(2)) // Fixed to return number with 2 decimals
}`],

				["5/response.md", `# assistant: Fixed decimal handling.
Retesting all components...`],

				["5/tasks.json", [{ "id": "cli-interface", "status": "complete" }, { "id": "exchange-model", "status": "complete" }]],
				["5/changelog.md", `# v1.0.0
- Initial CLI structure with help
- Exchange rate model with fixed conversion
- Unit tests added
- Integration test for CLI`],

				// Step 6: All tests pass and finalize release
				["6/test-results.log", ` PASS  test/unit/exchange.test.js
 PASS  test/integration/cli.test.js
All tests passed.`],

				["6/response.md", `# assistant: All tests passed.
Finalizing currency calculator release v1.0.0.`],

				["6/commit-message.md", `feat: currency calculator v1.0.0
- add \`convert(amount, from, to)\`
- add CLI interface
- include offline mock rates
- unit + integration tests passed`],

				["6/tasks.json", [{ "id": "release-currency-calc", "status": "complete" }]],

				// Step 7: Post-release verification
				["7/verification.md", `Release tagged as v1.0.0.
Tests: 4 passed, 0 failed.
CLI works offline and with default rates.`],

				["7/summary.json", {
					version: "v1.0.0",
					tasksComplete: 3,
					errorsFixed: 1,
					duration: "7min"
				}],
			]
		})

		const steps = []
		for (let step = 1; step <= 7; step++) {
			const db = root.extract(`${step}/`)
			const descriptions = [
				"Step 1: Initial planning with release scope and system instructions.",
				"Step 2: User initiates release; agent starts working on CLI interface.",
				"Step 3: Implements basic CLI and exchange logic; writes initial tests.",
				"Step 4: Runs tests and discovers decimal precision error.",
				"Step 5: Fixes decimal handling and retests; updates changelog.",
				"Step 6: Final tests pass; prepares commit message.",
				"Step 7: Post-release check and final metrics summary."
			]
			steps.push({ step, db, description: descriptions[step - 1] })
		}

		return steps
	}
}
