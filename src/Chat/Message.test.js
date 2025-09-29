import { suite, describe, it } from "node:test"
import assert from "node:assert"
import ChatMessage from "./Message.js"

describe("ChatMessage", () => {
	const chat = new ChatMessage({ content: "# Software developer\nI am an expert of a Javascript", role: "system" })
	const next = chat.add(new ChatMessage({ content: "Hello! How can I help you?", role: "assistant", username: "mac" }))
	const third = next.add(new ChatMessage({ content: "Hi. Write me a function y.", username: "me" }))
	third.add(new ChatMessage({ content: "const y = x => x ** x", role: "assistant", username: "mac" }))

	describe("flat()", () => {
		it("should properly return flat messages", () => {
			const flat = chat.flat()
			assert.strictEqual(flat.length, 4)
		})
	})

	describe("toString()", () => {
		it("should render with empty toString options", () => {
			const result = chat.toString()
			const expected = [
				"# system:\n# Software developer\nI am an expert of a Javascript",
				"",
				"# assistant:\nHello! How can I help you?",
				"",
				"# user:\nHi. Write me a function y.",
				"",
				"# assistant:\nconst y = x => x ** x"
			].join("\n")
			assert.strictEqual(result, expected)
		})

		it("should properly format standard format", () => {
			const result = chat.toString({ format: true })
			const expected = [
				"system      :# Software developer",
				"             I am an expert of a Javascript",
				"",
				"assistant @mac:Hello! How can I help you?",
				"",
				"user      @me :Hi. Write me a function y.",
				"",
				"assistant @mac:const y = x => x ** x"
			].join("\n")
			assert.strictEqual(result, expected)
		})

		it("should properly format short format", () => {
			const result = chat.toString({ format: "short" })
			const expected = [
				"sys   :# Software developer",
				"       I am an expert of a Javascript",
				"",
				"ass @mac:Hello! How can I help you?",
				"",
				"usr @me :Hi. Write me a function y.",
				"",
				"ass @mac:const y = x => x ** x"
			].join("\n")
			assert.strictEqual(result, expected)
		})

		it("should properly format with column width format", () => {
			const result = chat.toString({ format: "short", columns: [6, 4, 20], padding: 2 })
			const expected = [
				"sys       :# Software developer",
				"           I am an expert of a ",
				"           Javascript",
				"",
				"ass    @mac :Hello! How can I hel",
				"             p you?",
				"",
				"usr    @me  :Hi. Write me a funct",
				"             ion y.",
				"",
				"ass    @mac :const y = x => x ** ",
				"             x"
			].join("\n")
			assert.strictEqual(result, expected)
		})
	})
})
