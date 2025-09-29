import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { to, NonEmptyObject } from '@nan0web/types'
import Response from './Response.js'

suite('Response', () => {
	it('should create a response', () => {
		const response = Response.from({ content: 'Hello, world!' })
		assert.ok(response)
	})

	it('should renders a proper log', () => {
		const response = Response.from({
			content: 'Hello, world!',
			role: Response.ROLES.assistant,
			response_id: 'a1',
			usage: {
				prompt_tokens: 10,
				completion_tokens: 10,
				total_tokens: 20,
			}
		})

		const log = response.toLog()
		const json = JSON.stringify(to(Object)(to(NonEmptyObject)({
			response_id: 'a1',
			usage: {
				prompt_tokens: 10,
				completion_tokens: 10,
				thoughts_tokens: 0,
				cached_tokens: 0,
				total_tokens: 20,
				cost: 0,
			},
			complete: false,
			spentMs: 0,
			size: 13,
		})))

		const expected = [
			`<!-- ${json} -->`,
			'# assistant:',
			'Hello, world!'
		].join('\n')

		assert.equal(log, expected)
	})
})
