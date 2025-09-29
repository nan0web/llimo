import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import VitestLogDuration from './VitestLogDuration.js'

suite('VitestLogDuration', () => {
  it('should parse duration', () => {
    const duration = VitestLogDuration.parse('  Duration  5.82s (transform 35ms, setup 0ms, collect 42ms, tests 4.18s, environment 310ms, prepare 124ms)')
    assert.deepEqual(duration, { total: 5820, transform: 35, setup: 0, collect: 42, tests: 4180, environment: 310, prepare: 124 })
  })
})