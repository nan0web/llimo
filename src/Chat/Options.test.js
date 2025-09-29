import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ChatOptions from './Options.js'

suite('ChatOptions', () => {
  it('should create an instance of ChatOptions', () => {
    const options = new ChatOptions({
      temperature: 0.3,
      max_tokens: 256,
      top_p: 0.9
    })
    assert.ok(options instanceof ChatOptions)
    assert.equal(options.toString(), '0.3˚C 256T 0.9∆')
  })
  
  it('should create an instance of ChatOptions with defaults', () => {
    const options = new ChatOptions()
    assert.ok(options instanceof ChatOptions)
    assert.equal(options.toString(), '0.3˚C 256T 0.9∆')
  })
  
  it('should create an instance of ChatOptions with different defaults', () => {
    ChatOptions.DEFAULTS.temperature = 0.5
    ChatOptions.DEFAULTS.max_tokens = 512
    ChatOptions.DEFAULTS.top_p = 0.8
    const options = new ChatOptions()
    assert.ok(options instanceof ChatOptions)
    assert.equal(options.toString(), '0.5˚C 512T 0.8∆')
  })
})