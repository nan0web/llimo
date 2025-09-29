import { describe, it, beforeEach } from 'node:test'
import assert from 'node:assert/strict'
import ReleaserAgent from './ReleaserAgent.js'
import ReleaserChatContext from './ChatContext.js'
import ReleaserTask from './Task.js'
import ChatResponse from '../../Chat/Response.js'

describe('ReleaserAgent', () => {
	let agent

	beforeEach(() => {
		agent = new ReleaserAgent({})
	})

	it('should have correct static description', () => {
		assert.strictEqual(ReleaserAgent.desc, 'Releaser agent for handling release tasks from me.md')
	})

	it('should update context tasks to complete when response contains "completed"', async () => {
		const context = new ReleaserChatContext({})
		const stepResult = {
			response: new ChatResponse({ content: 'Release task completed', role: 'assistant' })
		}

		// Mock FS to return me.md content
		agent.fs = {
			loadDocumentAs: async (type, file) => '# Release v1.2.3\n- Task 1\n- Task 2'
		}

		await agent.updateTasksFromResponse(stepResult, context)

		assert.ok(context.tasks.length > 0)
		assert.ok(context.tasks[0] instanceof ReleaserTask)
		assert.strictEqual(context.tasks[0].status, 'done')
	})

	it('should update context tasks to processing when response does not contain "completed"', async () => {
		const context = new ReleaserChatContext({})
		const stepResult = {
			response: new ChatResponse({ content: 'Processing release tasks', role: 'assistant' })
		}

		// Mock FS to return me.md content
		agent.fs = {
			loadDocumentAs: async (type, file) => '# Release v1.2.3\n- Task 1\n- Task 2'
		}

		await agent.updateTasksFromResponse(stepResult, context)

		assert.ok(context.tasks.length > 0)
		assert.ok(context.tasks[0] instanceof ReleaserTask)
		assert.strictEqual(context.tasks[0].status, 'process')
	})

	it('should load initial tasks from me.md if context tasks are empty', async () => {
		const context = new ReleaserChatContext({ tasks: [] })
		const stepResult = {
			response: new ChatResponse({ content: 'Some response', role: 'assistant' })
		}

		// Mock FS to return me.md content
		agent.fs = {
			loadDocumentAs: async (type, file) => '# Release v1.2.3\n- Task 1\n- Task 2'
		}

		await agent.updateTasksFromResponse(stepResult, context)

		assert.ok(context.tasks.length > 0)
		assert.strictEqual(context.tasks[0].id, 'release-v1.2.3')
		assert.strictEqual(context.tasks[0].status, 'process')
	})

	it('should not update tasks if stepResult has error', async () => {
		const context = new ReleaserChatContext({ tasks: [new ReleaserTask({ id: 'test', status: 'pending' })] })
		const stepResult = {
			error: new Error('Test error')
		}

		await agent.updateTasksFromResponse(stepResult, context)

		assert.strictEqual(context.tasks[0].status, 'pending')
	})

	it('should not update tasks if stepResult has no response', async () => {
		const context = new ReleaserChatContext({ tasks: [new ReleaserTask({ id: 'test', status: 'pending' })] })
		const stepResult = {}

		await agent.updateTasksFromResponse(stepResult, context)

		assert.strictEqual(context.tasks[0].status, 'pending')
	})
})