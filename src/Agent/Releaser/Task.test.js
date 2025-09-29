import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ReleaserTask from './Task.js'

describe('ReleaserTask', () => {
	it('should construct with default values', () => {
		const task = new ReleaserTask({})
		assert.strictEqual(task.id, '')
		assert.strictEqual(task.content, '')
		assert.strictEqual(task.status, 'pending')
	})

	it('should construct with provided values', () => {
		const task = new ReleaserTask({
			id: 'task-1',
			content: 'Implement feature',
			status: 'process'
		})
		assert.strictEqual(task.id, 'task-1')
		assert.strictEqual(task.content, 'Implement feature')
		assert.strictEqual(task.status, 'process')
	})

	it('should validate status against allowed values', () => {
		assert.throws(() => {
			new ReleaserTask({ status: 'invalid-status' })
		}, TypeError)
	})

	it('should return STATUSES from static and instance methods', () => {
		const task = new ReleaserTask({})
		assert.deepStrictEqual(ReleaserTask.STATUSES, {
			pending: 'pending',
			process: 'process',
			done: 'done'
		})
		assert.deepStrictEqual(task.STATUSES, {
			pending: 'pending',
			process: 'process',
			done: 'done'
		})
	})

	it('should construct from another task instance', () => {
		const originalTask = new ReleaserTask({
			id: 'original',
			content: 'Original content',
			status: 'done'
		})
		const task = ReleaserTask.from(originalTask)
		assert.strictEqual(task, originalTask)
	})

	it('should construct new instance from plain object', () => {
		const taskData = {
			id: 'plain-task',
			content: 'Plain task content',
			status: 'process'
		}
		const task = ReleaserTask.from(taskData)
		assert.ok(task instanceof ReleaserTask)
		assert.strictEqual(task.id, 'plain-task')
		assert.strictEqual(task.content, 'Plain task content')
		assert.strictEqual(task.status, 'process')
	})
})