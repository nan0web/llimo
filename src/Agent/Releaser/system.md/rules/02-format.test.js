import { describe, it } from "node:test"
import assert from "node:assert/strict"
import ReleaserFormatRules from "./02-format.js"
import ChatResponse from "../../../../Chat/Response.js"

describe("ReleaserFormatRules", () => {
	it("should validate proper JSONL response", async () => {
		const rules = new ReleaserFormatRules()
		const validResponse = new ChatResponse(`{"file": "src/test.js", "content": "test"}\n{"file": "README.md", "content": "readme"}`)
		const result = await rules.validateResponse(validResponse)
		assert.strictEqual(result, true)
	})

	it("should invalidate malformed JSONL response", async () => {
		const rules = new ReleaserFormatRules()
		const invalidResponse = new ChatResponse(`{"file": "src/test.js", "content": "test"}\ninvalid json line`)
		const result = await rules.validateResponse(invalidResponse)
		assert.strictEqual(result, false)
	})

	it("should warn when validation fails with error message", async () => {
		const rules = new ReleaserFormatRules()
		const invalidResponse = new ChatResponse('invalid json')

		// Mock console.warn to track calls
		let warnCalled = false
		rules.console = {
			warn: () => { warnCalled = true },
			debug: () => {}
		}

		await rules.validateResponse(invalidResponse)
		assert.ok(warnCalled)
	})

	it("should debug error stack when available", async () => {
		const rules = new ReleaserFormatRules()
		const invalidResponse = new ChatResponse('invalid json')

		// Mock console.debug to track calls
		let debugCalled = false
		rules.console = {
			warn: () => {},
			debug: () => { debugCalled = true }
		}

		await rules.validateResponse(invalidResponse)
		assert.ok(debugCalled)
	})
})
