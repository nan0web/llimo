import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import ChatEventData from './EventData.js'

suite('ChatEventData', () => {
  it('should create empty instance', () => {
    const eventData = new ChatEventData()
    assert.ok(eventData)
  })
  
  it('should transfuse empty instance', () => {
    const eventData = ChatEventData.from()
    assert.ok(eventData)
  })
})