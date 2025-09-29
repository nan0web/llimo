import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Usage from './Usage.js'

suite('Usage', () => {
  it('calculates tokens correctly', () => {
    const usage = new Usage()
    usage.prompt_tokens = 100
    usage.completion_tokens = 50
    assert.equal(usage.tokensIn, 100)
    assert.equal(usage.tokensOut, 50)
    assert.equal(usage.total, 150)
  })

  it('formats string without cost', () => {
    const usage = new Usage()
    usage.prompt_tokens = 1000
    usage.completion_tokens = 2000
    assert.ok(usage.toString().includes('3,000 tokens'))
    assert.ok(!usage.toString().includes('$'))
  })

  it('formats string with cost', () => {
    const usage = new Usage()
    usage.prompt_tokens = 500
    usage.completion_tokens = 500
    usage.cost = 0.012345
    assert.ok(usage.toString().includes('$0.0123'))
  })
})