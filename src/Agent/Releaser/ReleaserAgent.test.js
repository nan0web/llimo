import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ReleaserAgent from './ReleaserAgent.js'
import ReleaserChatContext from './ChatContext.js'
import ReleaserTask from './Task.js'
import ChatResponse from '../../Chat/Response.js'

describe('ReleaserAgent', () => {
	let agent
	let context

	// Setup for each test
	function setupTest() {
		const taskData = {
			id: 'test-task',
			desc: 'Test task description',
			status: 'pending'
		}
		context = new ReleaserChatContext({ tasks: [taskData] })
		agent = new ReleaserAgent({ context })
	}

	it('should have correct static description', () => {
		assert.strictEqual(ReleaserAgent.desc, 'Releaser agent for handling release tasks from me.md')
	})

	describe('updateTasksFromResponse (Isolated)', () => {
		setupTest()

		it('should update tasks to complete on completion response', async () => {
			context.tasks[0].status = 'pending'
			const response = new ChatResponse({
				content: 'completed',
				role: 'assistant'
			})
			// Mock fs to return a string
			agent.fs = {
				loadDocumentAs: async (ext, file) => '# Release v1.0.0\n## Atoms\n### Agent class\nWrite an agent class for LLM operations.'
			}

			await agent.updateTasksFromResponse({ response }, context)
			assert.strictEqual(context.tasks[0].status, 'done')
		})

		it('should load initial tasks from me.md if none set', async () => {
			const mockContext = new ReleaserChatContext({ tasks: [] })
			agent = new ReleaserAgent({ context: mockContext })
			// Mock fs to return a string
			agent.fs = {
				loadDocumentAs: async (ext, file) => ['Release v1.0.0', '## Atoms', '### Agent class', 'Write an agent class for LLM operations.']
			}
			const response = new ChatResponse({ 
				content: 'something', 
				role: 'assistant' 
			})

			await agent.updateTasksFromResponse({ response }, mockContext)
			assert.ok(mockContext.tasks.length > 0)
			assert.strictEqual(mockContext.tasks[0].id, 'Release v1.0.0')
			assert.strictEqual(mockContext.tasks[0].status, 'process')
		})

		it('should handle error in stepResult without crashing', async () => {
			const stepResultError = { error: new Error('test error') }
			await agent.updateTasksFromResponse(stepResultError, context)
			assert.doesNotThrow(() => agent.updateTasksFromResponse(stepResultError, context))
		})
	})

	describe('createChat (Isolated)', () => {
		setupTest()

		it('should create chat from system.md with correct content', async () => {
			// Mock fs to return expected content
			agent.fs = {
				loadDocumentAs: async (ext, file) => {
					if (file === 'system.md') {
						return 'Формат комунікації\nВсі відповіді мають бути присвячені завданням з першого повідомлення релізу.'
					}
					return ''
				}
			}
			const initialChat = await agent.createChat()
			assert.ok(initialChat.content.includes('Формат комунікації'))
		})

		it('should throw if no FS connected', async () => {
			const agentNoFs = new ReleaserAgent({ context })
			agentNoFs.fs = undefined

			await assert.rejects(
				() => agentNoFs.createChat(),
				/You must connect a FS database/
			)
		})
	})
})