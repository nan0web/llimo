import { describe, it } from "node:test"
import assert from "node:assert/strict"
import { NoConsole } from "@nan0web/log"
import ReleaserFormatRules from "./02-format.js"
import ChatResponse from "../../../../Chat/Response.js"

describe("ReleaserFormatRules", () => {
	it("should validate proper JSONL response", async () => {
		const rules = new ReleaserFormatRules()
		const validResponse = new ChatResponse({ content: `{"file": "src/test.js", "content": "test"}\n{"file": "README.md", "content": "readme"}`, role: "assistant" })
		const result = await rules.validateResponse(validResponse)
		assert.strictEqual(result, true)
	})

	it("should invalidate malformed JSONL response", async () => {
		const rules = new ReleaserFormatRules({ console: new NoConsole() })
		const invalidResponse = new ChatResponse({ content: `{"file": "src/test.js", "content": "test"}\ninvalid json line`, role: "assistant" })
		const result = await rules.validateResponse(invalidResponse)
		assert.equal(rules.console.output()[0][1], `Unexpected token 'i', "invalid json line" is not valid JSON`)
		assert.strictEqual(result, false)
	})

	it("should warn when validation fails with error message", async () => {
		const rules = new ReleaserFormatRules({ console: new NoConsole() })
		const invalidResponse = new ChatResponse({ content: 'invalid json', role: "assistant" })

		await rules.validateResponse(invalidResponse)
		assert.equal(rules.console.output()[0][1], `Unexpected token 'i', "invalid json" is not valid JSON`)
	})

	it("should debug error stack when available", async () => {
		const rules = new ReleaserFormatRules({ console: new NoConsole() })
		const invalidResponse = new ChatResponse({ content: 'invalid json', role: "assistant" })

		await rules.validateResponse(invalidResponse)
		assert.equal(rules.console.output()[0][1], `Unexpected token 'i', "invalid json" is not valid JSON`)
	})
})
