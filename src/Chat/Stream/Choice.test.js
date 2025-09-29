import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ChatChoice from './Choice.js'
import ChatDelta from './Delta.js'

suite('ChatChoice', () => {
  it('should create empty instance', () => {
    const choice = new ChatChoice()
    assert.ok(choice instanceof ChatChoice)
    assert.ok(choice.delta instanceof ChatDelta)
    assert.equal(choice.finish_reason, null)
    assert.equal(choice.index, 0)
    assert.equal(choice.logprobs, null)
  })

  it('should create from props', () => {
    const choice = new ChatChoice({
      delta: { content: 'Hello' },
      finish_reason: 'stop',
      index: 1,
      logprobs: 'info',
    })

    assert.ok(choice.delta instanceof ChatDelta)
    assert.equal(choice.delta.content, 'Hello')
    assert.equal(choice.finish_reason, 'stop')
    assert.equal(choice.index, 1)
    assert.equal(choice.logprobs, 'info')
  })

  it('should use static from correctly', () => {
    const data = { delta: { content: 'Test' }, index: 5 }
    const a = ChatChoice.from(data)
    const b = ChatChoice.from(a)

    assert.ok(a instanceof ChatChoice)
    assert.equal(b, a) // same instance
  })
})