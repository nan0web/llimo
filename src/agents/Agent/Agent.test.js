import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Agent from './Agent.js'
import ChatMessage from '../../Chat/Message.js'

suite('Agent', () => {
	let agent

	it('beforeAll', () => {
		agent = new Agent()
		agent.inputPipeline = ['step1', 'step2']
	})

	/**
	 * Mock function to simulate a step in the pipeline.
	 * @param {ChatMessage} message
	 * @param {ChatMessage[]} chat
	 * @param {object} context
	 */
	const mockStep = async (chat, context) => {
		context.calledSteps.push(chat.role)
		return true
	}

	describe('transform', () => {
		it('should call each step in the pipeline', async () => {
			const message = new ChatMessage('user', { content: 'Hello', role: 'user' })
			const chat = message
			const context = { calledSteps: [] }

			agent.step1 = mockStep
			agent.step2 = mockStep

			await agent.transformInput(chat, context)

			assert.deepEqual(context.calledSteps, ['user', 'user'])
		})

		it('should not call steps if pipeline is empty', async () => {
			const message = new ChatMessage('user', { content: 'Hello', role: 'user' })
			const chat = message
			const context = { calledSteps: [] }

			agent.inputPipeline = []

			await agent.transformInput(chat, context)

			assert.deepEqual(context.calledSteps, [])
		})

		it('should handle null pipeline', async () => {
			const message = new ChatMessage('user', { content: 'Hello', role: 'user' })
			const chat = message
			const context = { calledSteps: [] }

			await agent.transformOutput(chat, context)

			assert.deepEqual(context.calledSteps, [])
		})
	})
})
