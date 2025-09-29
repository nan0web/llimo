import { describe, it, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import DB from "@nan0web/db"
import event from "@nan0web/event"
import ReleaserAgent from "../ReleaserAgent.js"
import ReleaserChatContext from "../ChatContext.js"
import ChatModel from "../../../Chat/Model/Model.js"
import ChatProvider from "../../../Chat/Provider.js"
import ChatMessage from "../../../Chat/Message.js"
import ChatResponse from "../../../Chat/Response.js"
import App from "../../../App.js"
import systemMd from "../system.md/index.js"

// Mock classes to avoid real API calls
class TestModel extends ChatModel {
	constructor() {
		super({ name: "test-model" })
	}
}

class TestDriver {
	constructor() {
		this.bus = event() // Use event module for on/off/emit
	}

	async init() {
		// No-op for mock
		return Promise.resolve()
	}

	on(event, fn) {
		this.bus.on(event, fn)
	}

	off(event, fn) {
		this.bus.off(event, fn)
	}

	emit(event, data) {
		this.bus.emit(event, data)
	}

	async stream(input, model, onData) {
		// Simulate async stream with chunks
		const chunks = ["Processing", " release", " tasks..."]
		for (const chunk of chunks) {
			onData(chunk)
			// Emit data event for the listener setup in run()
			this.emit("data", { chunk, input, model })
		}
		// Emit end after chunks
		const mockResponse = new ChatResponse({ content: "Mock release response: v1.0.0 completed", role: "assistant" })
		mockResponse.model = model.name
		mockResponse.usage = { prompt_tokens: 10, completion_tokens: 20, total_tokens: 30 }
		this.emit("end", mockResponse)
		return mockResponse
	}
}

class TestProvider extends ChatProvider {
	constructor() {
		super({ name: "test-provider" })
		this.driver = new TestDriver()
	}

	async init() {
		// No-op for mock
		await this.driver.init()
	}
}

describe("ReleaserAgent Components (Atomic Tests)", () => {
	describe("Basic Construction", () => {
		let agent, fs, db

		beforeEach(() => {
			fs = new DB({ predefined: [["me.md", "# Release v1.0.0\n- Task 1\n- Task 2"]] })
			db = new DB({ root: "./.tmp/db" })
			agent = new ReleaserAgent({ db, fs })
		})

		it("should construct without errors", () => {
			assert.ok(agent instanceof ReleaserAgent)
			assert.ok(agent.fs)
			assert.ok(agent.db)
		})

		it("should have correct static properties", () => {
			assert.strictEqual(ReleaserAgent.desc, "Releaser agent for handling release tasks from me.md")
		})
	})

	describe("updateTasksFromResponse (Isolated)", () => {
		let agent, context, stepResult

		beforeEach(() => {
			const fs = new DB({ predefined: [["me.md", "# Release v1.0.0\n- Task 1\n- Task 2"]] })
			const db = new DB()
			const app = new App({ chatProvider: new TestProvider(), chatModel: new TestModel() })
			agent = new ReleaserAgent({ app, db, fs })
			context = new ReleaserChatContext({ agent })
			stepResult = { response: new ChatResponse({ content: "completed", role: "assistant" }) }
		})

		it("should update tasks to complete on completion response", async () => {
			await agent.updateTasksFromResponse(stepResult, context)
			assert.ok(context.tasks.length > 0)
			assert.strictEqual(context.tasks[0].status, "done")
		})

		it("should load initial tasks from me.md if none set", async () => {
			const stepResultEmpty = { response: new ChatResponse({ content: "something", role: "assistant" }) }
			await agent.updateTasksFromResponse(stepResultEmpty, context)
			assert.ok(context.tasks.length > 0)
			assert.strictEqual(context.tasks[0].status, "process")
		})

		it("should handle error in stepResult without crashing", async () => {
			const stepResultError = { error: new Error("test error") }
			await agent.updateTasksFromResponse(stepResultError, context)
			assert.doesNotThrow(() => agent.updateTasksFromResponse(stepResultError, context))
		})
	})

	describe("createChat (Isolated)", () => {
		let agent, fs

		beforeEach(() => {
			fs = new DB({
				predefined: [
					["system.md", systemMd]
				]
			})
		})

		it("should create chat from system.md with correct content", async () => {
			const db = new DB()
			agent = new ReleaserAgent({ db, fs })
			const initialChat = await agent.createChat()
			assert.ok(initialChat instanceof ChatMessage)
			assert.strictEqual(initialChat.role, ChatMessage.ROLES.system)
			assert.ok(initialChat.content.includes("Формат комунікації"))
		})

		it("should throw if no FS connected", async () => {
			const agentNoFs = new ReleaserAgent({ db: new DB(), app: new App() }) // No FS

			await assert.rejects(
				() => agentNoFs.createChat(),
				/You must connect a FS database/,
				"Should require FS"
			)
		})
	})
})

describe("Correct release scenario", () => {
	let fs, db, agent, context, app, originalLoad, loadCalled

	beforeEach(async () => {
		// Setup FS with release content in me.md
		fs = new DB({
			predefined: [
				["system.md", systemMd],
				["me.md", `# Release v1.0.0\n## Atoms\n### Agent class\nWrite an agent class for LLM operations.\n- [x] Implement base class\n- [ ] Add Releaser extension`]
			]
		})

		db = new DB({ root: "./.tmp/db" }) // Temporary DB

		app = new App({
			chatProvider: new TestProvider(),
			chatModel: new TestModel()
		})

		agent = new ReleaserAgent({
			app, // Pass the app with provider and model
			db,
			fs, // Pass FS explicitly
			name: "Releaser Test Agent",
			desc: "Test releaser with mocked dependencies"
		})

		context = new ReleaserChatContext({
			model: new TestModel(),
			provider: new TestProvider(),
			agent,
		})

		// Mock the FS load to track calls and provide system.md
		originalLoad = fs.loadDocumentAs
		loadCalled = 0
		fs.loadDocumentAs = async (type, doc) => {
			loadCalled++
			if (doc === "system.md") {
				return systemMd
			}
			if (doc === "me.md") {
				return "# Release v1.0.0\n## Atoms\n### Agent class\nWrite an agent class for LLM operations.\n- [x] Implement base class\n- [ ] Add Releaser extension"
			}
			return originalLoad.call(fs, type, doc)
		}
	})

	afterEach(async () => {
		// Cleanup temporary DB if needed
		await db.disconnect()
		// Restore original
		if (originalLoad) fs.loadDocumentAs = originalLoad
	})

	describe("Common functions", () => {
		it("initializes agent and creates chat from system instructions", async () => {
			const initialChat = await agent.createChat()
			assert.ok(initialChat instanceof ChatMessage)
			assert.strictEqual(initialChat.role, ChatMessage.ROLES.system)
			assert.ok(initialChat.content.includes("Формат комунікації"))
		})

		it("throws error if no FS connected during createChat", async () => {
			const noFsAgent = new ReleaserAgent({ db: new DB(), app: new App() }) // No FS

			await assert.rejects(
				() => noFsAgent.createChat(),
				/You must connect a FS database/,
				"Should throw if no FS for loading documents"
			)
		})
	})

	describe("Single Turn Processing", () => {
		it("should load system.md during createChat (load tracking)", async () => {
			const beforeLoad = loadCalled
			await agent.createChat() // Loads system.md
			assert.strictEqual(loadCalled, beforeLoad + 1)
			const meContent = await fs.loadDocumentAs(".txt", "me.md") // Explicit load for me.md
			assert.ok(meContent.includes("Release v1.0.0"))
		})

		it("loads release tasks from me.md and processes single turn", async () => {
			// Ensure app has provider and model
			agent.app.chatProvider = context.provider
			agent.app.chatModel = context.model

			// Call createChat to load system.md
			const systemMsg = await agent.createChat()
			context.chat.add(systemMsg)

			// Set initial user message
			const userMsg = new ChatMessage({ role: "user", content: "Initiate release v1.0.0" })
			context.chat.add(userMsg)

			// Run the agent process
			const result = await agent.run(context, {
				maxLoops: 1,
				onStepEnd: async () => true // Continue after first step
			})

			assert.ok(result, "Run should return a result")
			assert.ok(result.response, "Result should have a response")
			assert.ok(result.response.content.includes("completed"))
			assert.strictEqual(loadCalled, 2, "Should load system.md and me.md") // From createChat and updateTasks

			// Check that tasks were updated
			assert.deepStrictEqual(context.tasks.map(t => ({ id: t.id, status: t.status })), [
				{ id: "release-v1.0.0", status: "done" }
			])

			// Verify context updates
			assert.strictEqual(context.loopCount, 1)
			assert.ok(!context.cancelled)
		})
	})

	describe("Multi-Turn Handling", () => {
		beforeEach(async () => {
			// Reset for multi-turn
			context = new ReleaserChatContext({
				model: new TestModel(),
				provider: new TestProvider(),
				agent,
			})
			// Add system message
			const systemMsg = await agent.createChat()
			context.chat.add(systemMsg)
			// Add first user message
			context.chat.add(new ChatMessage({ role: "user", content: "Process release step 1" }))
		})

		it("should handle multiple loops without driver errors", async () => {
			class MockReleaserAgent extends ReleaserAgent {
				callIndex = 0
				mockResponses = [
					new ChatResponse({ content: "Processing release tasks...", role: "assistant" }),
					new ChatResponse({ content: "Release v1.0.0 completed", role: "assistant" })
				]
				async mockSingleTurn(input, ctx) {
					const response = this.mockResponses[this.callIndex % this.mockResponses.length]
					this.callIndex++
					return { response, error: null }
				}

				async runSingleTurn(input, context) {
					return await this.mockSingleTurn(input, context)
				}

				shouldLoop(context) {
					return true
				}

				getInputFromContext(context) {
					if (this.callIndex === 1) {
						// Add second user message for multi-turn simulation
						const user2 = new ChatMessage({ role: "user", content: "Next step" })
						context.chat.add(user2)
						return user2
					}
					return super.getInputFromContext(context)
				}
			}

			const mockAgent = new MockReleaserAgent({
				app, // Pass the app with provider and model
				db,
				fs, // Pass FS explicitly
				name: "Releaser Test Agent",
				desc: "Test releaser with mocked dependencies"
			})

			const multiResult = await mockAgent.run(context, {
				maxLoops: 3,
				onStepEnd: async () => mockAgent.callIndex < 2 // Continue for 2 loops
			})

			// Loose check for key messages in order
			const chatLog = String(context.chat).split("\n").filter(Boolean)
			assert.ok(chatLog.some(l => l.includes("Process release step 1")), "First user message present")
			assert.ok(chatLog.some(l => l.includes("Processing release tasks...")), "First assistant response present")
			assert.ok(chatLog.some(l => l.includes("Next step")), "Second user message present")
			assert.ok(chatLog.some(l => l.includes("Release v1.0.0 completed")), "Second assistant response present")

			assert.strictEqual(multiResult.response.content, "Release v1.0.0 completed")
			assert.strictEqual(mockAgent.callIndex, 2, "Should call runSingleTurn twice")
			assert.ok(context.tasks.length > 0, "Tasks should be updated")
			assert.strictEqual(context.tasks[0].status, "done")
			assert.strictEqual(context.loopCount, 2, "Should increment loopCount twice")
		})
	})

})
