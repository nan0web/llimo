import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ReleaserTask from './Task.js'

describe('ReleaserTask', () => {
	it('should construct with default values', () => {
		const task = new ReleaserTask({})
		assert.ok(task instanceof ReleaserTask)
		assert.strictEqual(task.id, '')
		assert.strictEqual(task.desc, '')
		assert.strictEqual(task.status, 'pending')
	})

	it('should construct with provided values', () => {
		const task = new ReleaserTask({
			id: 'task-1',
			desc: 'Task 1 description',
			status: 'process'
		})
		assert.ok(task instanceof ReleaserTask)
		assert.strictEqual(task.id, 'task-1')
		assert.strictEqual(task.desc, 'Task 1 description')
		assert.strictEqual(task.status, 'process')
	})

	it('should validate status against allowed values', () => {
		assert.throws(() => {
			new ReleaserTask({ status: 'invalid-status' })
		}, TypeError)
	})

	it('should return STATUSES from static method', () => {
		assert.deepStrictEqual(ReleaserTask.STATUSES, {
			pending: 'pending',
			process: 'process',
			done: 'done'
		})
	})

	it('should construct from another task instance', () => {
		const originalTask = new ReleaserTask({
			id: 'original',
			desc: 'Original content',
			status: 'done'
		})
		const task = ReleaserTask.from(originalTask)
		assert.strictEqual(task, originalTask)
	})

	it('should construct plain object', () => {
		const taskData = {
			id: 'plain-task',
			desc: 'Plain task content',
			status: 'process'
		}
		const task = ReleaserTask.from(taskData)
		assert.ok(task instanceof ReleaserTask)
		assert.strictEqual(task.id, 'plain-task')
		assert.strictEqual(task.desc, 'Plain task content')
		assert.strictEqual(task.status, 'process')
	})
})