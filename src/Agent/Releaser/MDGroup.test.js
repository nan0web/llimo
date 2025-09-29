import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import MDGroup from './MDGroup.js'
import { MDHeading2 } from '@nan0web/markdown'

describe('MDGroup', () => {
	it('should construct from string content', () => {
		const group = MDGroup.from('Agents')
		assert.ok(group instanceof MDGroup)
		assert.strictEqual(group.content, 'Agents')
	})

	it('should construct from MDHeading2 instance', () => {
		const heading = new MDHeading2({ content: 'Components' })
		const group = MDGroup.from(heading)
		assert.ok(group instanceof MDGroup)
		assert.strictEqual(group.content, 'Components')
	})

	it('should return the same instance if input is already MDGroup', () => {
		const originalGroup = new MDGroup({ content: 'Test Group' })
		const group = MDGroup.from(originalGroup)
		assert.strictEqual(group, originalGroup)
	})

	it('should correctly serialize to string', () => {
		const group = new MDGroup({ content: 'Test Group' })
		assert.strictEqual(String(group), '## Test Group')
	})
})