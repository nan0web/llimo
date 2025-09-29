import { describe, it, beforeEach, afterEach } from "node:test"
import assert from "node:assert/strict"
import DB from "@nan0web/db"
import event from "@nan0web/event"
import ReleaserAgent from "../ReleaserAgent.js"
import ReleaserChatContext from "../ChatContext.js"
import ChatModel from "../../../Chat/Model.js"
import ChatProvider from "../../../Chat/Provider.js"
import ChatMessage from "../../../Chat/Message.js"
import ChatResponse from "../../../Chat/Response.js"
import App from "../../../App.js"

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
		const mockResponse = new ChatResponse("Mock release response: v1.0.0 completed")
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
			stepResult = { response: new ChatResponse("completed") }
		})

		it("should update tasks to complete on completion response", async () => {
			await agent.updateTasksFromResponse(stepResult, context)
			assert.ok(context.tasks.length > 0)
			assert.strictEqual(context.tasks[0].status, "done")
		})

		it("should load initial tasks from me.md if none set", async () => {
			const stepResultEmpty = { response: new ChatResponse("something") }
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
					["system.md", "# Instructions\nYou are a good assistant\n"]
				]
			})
		})

		it("should create chat from system.md with correct content", async () => {
			const db = new DB()
			agent = new ReleaserAgent({ db, fs })
			const initialChat = await agent.createChat()
			assert.ok(initialChat instanceof ChatMessage)
			assert.strictEqual(initialChat.role, ChatMessage.ROLES.system)
			assert.ok(initialChat.content.includes("You are a good assistant"))
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
				["system.md", "# Instructions\nYou are a good assistant\n"],
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
			loopCount: 0,
		})

		// Mock the FS load to track calls and provide system.md
		originalLoad = fs.loadDocument
		loadCalled = 0
		fs.loadDocument = async (doc, defaultValue) => {
			loadCalled++
			if (doc === "system.md") {
				return "# Instructions\nYou are a good assistant\n"
			}
			if (doc === "me.md") {
				return "# Release v1.0.0\n## Atoms\n### Agent class\nWrite an agent class for LLM operations.\n- [x] Implement base class\n- [ ] Add Releaser extension"
			}
			return originalLoad.call(fs, doc, defaultValue)
		}
	})

	afterEach(async () => {
		// Cleanup temporary DB if needed
		await db.disconnect()
		// Restore original
		if (originalLoad) fs.loadDocument = originalLoad
	})

	describe("Common functions", () => {
		it("initializes agent and creates chat from system instructions", async () => {
			const initialChat = await agent.createChat()
			assert.ok(initialChat instanceof ChatMessage)
			assert.strictEqual(initialChat.role, ChatMessage.ROLES.system)
			assert.ok(initialChat.content.includes("You are a good assistant"))
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
			const meContent = await fs.loadDocument("me.md") // Explicit load for me.md
			assert.ok(meContent.includes("Release v1.0.0"))
		})

		it.skip("loads release tasks from me.md and processes single turn", async () => {
			// Ensure app has provider and model
			agent.app.chatProvider = context.provider
			agent.app.chatModel = context.model

			// Call createChat to load system.md
			await agent.createChat()

			// Set initial user message
			context.chat = new ChatMessage({ role: "user", content: "Initiate release v1.0.0" })

			// Run the agent process
			// @todo fix the freezing (infiite loop, because loopCount = amount of #assistant roles messages in the chat)
			// use a stack of chat messages that should be fetched step by step
			const result = await agent.run(context, {
				maxLoops: 1,
				onStepEnd: async () => true // Continue after first step
			})

			assert.ok(result, "Run should return a result")
			assert.ok(result.response, "Result should have a response")
			assert.strictEqual(result.response.content, "Mock release response: v1.0.0 completed")
			assert.strictEqual(loadCalled, 2, "Should load system.md and me.md") // From createChat and updateTasks

			// Check that tasks were updated
			assert.deepStrictEqual(context.tasks, [
				{ id: "release-v1.0.0", status: "done" }
			])

			// Verify context updates
			assert.strictEqual(context.loopCount, 1)
			assert.ok(!context.cancelled)
		})
	})

	describe("Multi-Turn Handling", () => {
		beforeEach(() => {
			// Reset for multi-turn
			context = new ReleaserChatContext({
				model: new TestModel(),
				provider: new TestProvider(),
				agent,
				loopCount: 0,
			})
			context.chat = new ChatMessage({ role: "user", content: "Process release step 1" })
		})

		it("should handle multiple loops without driver errors", async () => {
			// Ensure app setup
			agent.app.chatProvider = context.provider
			agent.app.chatModel = context.model

			// Override runSingleTurn for controlled simulation
			const mockResponses = [
				new ChatResponse("Processing release tasks..."),
				new ChatResponse("Release v1.0.0 completed")
			]
			let callIndex = 0
			const originalRunSingleTurn = agent.runSingleTurn
			const mockSingleTurn = async (input, ctx) => {
				const response = mockResponses[callIndex % mockResponses.length]
				callIndex++
				ctx.loopCount++
				return { response }
			}
			agent.runSingleTurn = mockSingleTurn

			try {
				const multiResult = await agent.run(context, {
					maxLoops: 2,
					onStepEnd: async () => callIndex < 2 // Continue for 2 loops
				})

				assert.strictEqual(multiResult.response.content, "Release v1.0.0 completed")
				assert.strictEqual(callIndex, 2, "Should call runSingleTurn twice")
				assert.ok(context.tasks.length > 0, "Tasks should be updated")
				assert.strictEqual(context.tasks[0].status, "done")
				assert.strictEqual(context.loopCount, 2, "Should increment loopCount twice")
			} finally {
				agent.runSingleTurn = originalRunSingleTurn
			}
		})
	})

})