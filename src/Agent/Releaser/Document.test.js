import { describe, it } from 'node:test'
import { strict as assert } from 'node:assert'
import ReleaserDocument from './Document.js'
import MDRelease from './MDRelease.js'
import MDGroup from './MDGroup.js'
import MDTask from './MDTask.js'

describe('ReleaserDocument', () => {
	it('should parse a release document with release, groups, tasks and notes correctly', () => {
		const inputText = `
# MVP release - v0.1.0

Some general note at the start.

## Agents

### Releaser agent
This is a task note.
More details here.

## Components

### Editor
Some content for editor task.

End note without heading.
`

		const doc = ReleaserDocument.from(inputText)

		assert.ok(doc instanceof ReleaserDocument)

		// Check release parsing
		assert.ok(doc.release instanceof MDRelease)
		assert.equal(doc.release.name, 'MVP release')
		assert.equal(doc.release.major, '0')
		assert.equal(doc.release.minor, '1')
		assert.equal(doc.release.patch, '0')
		assert.equal(doc.release.version, 'v0.1.0')

		// Check notes parsing
		assert.equal(doc.notes.length, 1)
		assert.equal(doc.notes[0].content.trim(), 'Some general note at the start.')

		// Check groups parsing
		assert.equal(doc.groups.length, 2)
		assert.ok(doc.groups[0] instanceof MDGroup)
		assert.equal(doc.groups[0].content, 'Agents')
		assert.ok(doc.groups[1] instanceof MDGroup)
		assert.equal(doc.groups[1].content, 'Components')

		// Check tasks parsing and linkage
		assert.equal(doc.tasks.length, 2)
		assert.ok(doc.tasks[0] instanceof MDTask)
		assert.equal(doc.tasks[0].content, 'Releaser agent')
		assert.ok(doc.tasks[1] instanceof MDTask)
		assert.equal(doc.tasks[1].content, 'Editor')

		// Ensure tasks are correctly assigned to their groups
		assert.equal(doc.groups[0].children.length, 1)
		assert.equal(doc.groups[0].children[0], doc.tasks[0])
		assert.equal(doc.groups[1].children.length, 1)
		assert.equal(doc.groups[1].children[0], doc.tasks[1])
	})

	it('should throw error for invalid release version format', () => {
		const invalidInput = `# Invalid release - invalid.version.format`

		assert.throws(() => {
			ReleaserDocument.from(invalidInput)
		}, TypeError)
	})

	it('should correctly serialize to string', () => {
		const inputText = `
# MVP release - v0.1.0

Some general note at the start.

## Agents

### Releaser agent
This is a task note.
More details here.

## Components

### Editor
Some content for editor task.

End note without heading.
`

		const doc = ReleaserDocument.from(inputText)
		const outputString = doc.toString().replace(/\n{3,}/g, '\n\n').trim()

		const expectedString = `MVP release - v0.1.0

Some general note at the start.

## Agents

### Releaser agent

This is a task note.

More details here.

## Components

### Editor

Some content for editor task.

End note without heading.`.replace(/\n{3,}/g, '\n\n').trim()

		assert.equal(outputString, expectedString)
	})
})