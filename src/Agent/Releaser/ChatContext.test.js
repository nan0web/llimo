import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ReleaserChatContext from './ChatContext.js'
import ReleaserTask from './Task.js'

describe('ReleaserChatContext', () => {
	it('should initialize with tasks from input', () => {
		const taskData = { id: 'test-task', content: 'Test task content', status: 'pending' }
		const context = new ReleaserChatContext({ tasks: [taskData] })

		assert.ok(context.tasks[0] instanceof ReleaserTask)
		assert.strictEqual(context.tasks[0].id, 'test-task')
		assert.strictEqual(context.tasks[0].content, 'Test task content')
		assert.strictEqual(context.tasks[0].status, 'pending')
	})

	it('should initialize with empty tasks array if none provided', () => {
		const context = new ReleaserChatContext({})
		assert.deepStrictEqual(context.tasks, [])
	})

	it('should correctly serialize to JSON', () => {
		const taskData = { id: 'test-task', content: 'Test task content', status: 'pending' }
		const context = new ReleaserChatContext({ tasks: [taskData] })

		const serialized = JSON.stringify(context)
		const parsed = JSON.parse(serialized)

		assert.ok(Array.isArray(parsed.tasks))
		assert.strictEqual(parsed.tasks[0].id, 'test-task')
		assert.strictEqual(parsed.tasks[0].content, 'Test task content')
		assert.strictEqual(parsed.tasks[0].status, 'pending')
	})
})