import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import MDTask from './MDTask.js'
import { MDHeading3 } from '@nan0web/markdown'

describe('MDTask', () => {
	it('should construct from string content', () => {
		const task = MDTask.from('Releaser agent')
		assert.ok(task instanceof MDTask)
		assert.strictEqual(task.content, 'Releaser agent')
		assert.strictEqual(task.id, 'releaser-agent')
	})

	it('should construct from MDHeading3 instance', () => {
		const heading = new MDHeading3({ content: 'Editor component' })
		const task = MDTask.from(heading)
		assert.ok(task instanceof MDTask)
		assert.strictEqual(task.content, 'Editor component')
		assert.strictEqual(task.id, 'editor-component')
	})

	it('should return the same instance if input is already MDTask', () => {
		const originalTask = new MDTask({ content: 'Original Task', id: 'original-task' })
		const task = MDTask.from(originalTask)
		assert.strictEqual(task, originalTask)
	})

	it('should correctly serialize to string', () => {
		const task = new MDTask({ content: 'Test Task' })
		assert.strictEqual(String(task), '### Test Task')
	})
})