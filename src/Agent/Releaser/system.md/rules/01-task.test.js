import { describe, it } from "node:test"
import assert from "node:assert/strict"
import ReleaserTaskRules from "./01-task.js"
import ChatMessage from "../../../../Chat/Message.js"

describe("ReleaserTaskRules", () => {
	it("should validate input with '# Release'", async () => {
		const rules = new ReleaserTaskRules()
		const validMessage = new ChatMessage({
			role: "user",
			content: "# Release v1.0.0\n- Task 1\n- Task 2"
		})
		const result = await rules.validateInput(validMessage)
		assert.strictEqual(result, true) // Should return true for valid input
	})

	it("should invalidate input without '# Release'", async () => {
		const rules = new ReleaserTaskRules()
		const invalidMessage = new ChatMessage({
			role: "user",
			content: "Some random content without release header"
		})
		const result = await rules.validateInput(invalidMessage)
		assert.strictEqual(result, false)
	})

	it("should warn when input validation fails", async () => {
		const rules = new ReleaserTaskRules()
		const invalidMessage = new ChatMessage({
			role: "user",
			content: "Invalid content"
		})

		// Mock console.warn to track calls
		let warnCalled = false
		rules.console = {
			warn: () => { warnCalled = true }
		}

		await rules.validateInput(invalidMessage)
		assert.ok(warnCalled)
	})
})