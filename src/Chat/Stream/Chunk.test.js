import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ChatChunk from './Chunk.js'
import ChatChoice from './Choice.js'

suite('ChatChunk', () => {
  it('should create empty instance', () => {
    const chunk = new ChatChunk()
    assert.ok(chunk instanceof ChatChunk)
    assert.deepEqual(chunk.choices, [])
  })

  it('should create from full props', () => {
    const chunk = new ChatChunk({
      id: 'abc123',
      object: 'chat.completion.chunk',
      created: 123456,
      model: 'gpt-4.1',
      service_tier: 'default',
      system_fingerprint: 'fp_0000',
      choices: [
        { index: 0, delta: { content: 'Hi' }, finish_reason: null }
      ],
    })

    assert.equal(chunk.id, 'abc123')
    assert.equal(chunk.object, 'chat.completion.chunk')
    assert.equal(chunk.model, 'gpt-4.1')
    assert.equal(chunk.choices.length, 1)
    assert.ok(chunk.choices[0] instanceof ChatChoice)
    assert.equal(chunk.choices[0].delta.content, 'Hi')
  })

  it('should use static from', () => {
    const chunk = ChatChunk.from({ model: 'nano', choices: [] })
    assert.equal(chunk.model, 'nano')

    const again = ChatChunk.from(chunk)
    assert.equal(again, chunk)
  })
})