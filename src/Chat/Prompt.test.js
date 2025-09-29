import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Prompt from './Prompt.js'

suite('Prompt', () => {
  it('should create with role and content', () => {
    const prompt = new Prompt({ role: Prompt.ROLES.assistant, content: 'Hello' })
    assert.equal(prompt.role, 'assistant')
    assert.equal(prompt.content, 'Hello')
  })

  it('static from() should create from string', () => {
    const prompt = Prompt.from('test content')
    assert.ok(prompt instanceof Prompt)
    assert.equal(prompt.content, 'test content')
  })

  it('static from() should create from array', () => {
    const arr = [{ role: 'user', content: 'Hi' }, { role: 'assistant', content: 'Hello' }]
    const prompt = Prompt.from(arr)
    assert.ok(prompt instanceof Prompt)
    assert.equal(prompt.content, 'Hi')
  })

  it('toArray() should return array including children', () => {
    const prompt = new Prompt({ content: 'Hello' })
    const child = new Prompt({ role: Prompt.ROLES.assistant, content: 'Hi' })
    prompt.add(child)
    const arr = prompt.flat()
    assert.ok(arr.length > 1)
    assert.equal(arr[0].content, 'Hello')
    assert.equal(arr[1].content, 'Hi')
  })

  it('toString() should return formatted string', () => {
    const prompt = new Prompt('Hello')
    const child = new Prompt({ role: Prompt.ROLES.assistant, content: 'Hi' })
    prompt.add(child)
    const str = prompt.toString()
    assert.ok(str.includes('user: Hello'))
    assert.ok(str.includes('assistant: Hi'))
  })
})