import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import HuggingFaceDriver from './HuggingFaceDriver.js'
import Prompt from '../../Prompt.js'
import Model from '../../Model.js'

suite('HuggingFaceDriver', () => {
  let driver
  const model = Model.from({ name: 'DeepSeek-V3-0324' })
  
  it('beforeEach', async () => {
    driver = new HuggingFaceDriver({
      auth: { apiKey: 'test' },
      model,
      options: {
        provider: "novita",
      }
    })
    await driver.init()
  })

  it('should initialize client', () => {
    assert.ok(driver.client)
  })

  it('should emit events during completion', async () => {
    const events = []
    driver.on('start', e => events.push('start'))
    driver.on('stream', e => events.push('stream'))
    driver.on('data', e => events.push('data'))
    driver.on('end', e => events.push('end'))
    const prompt = Prompt.from('Hello')
    await driver._complete(prompt, driver.model)
    assert.deepEqual(events, ['start', 'stream', 'data', 'end'])
  })

  it('should throw error if no apiKey', async () => {
    const d = new HuggingFaceDriver({ auth: {} })
    await assert.rejects(d.init(), /Hugging Face API key is required/)
  })

  it('should get model by name', () => {
    const model = driver.getModel('deepseek-ai/DeepSeek-V3')
    assert.ok(model)
  })

  it('should throw if client not initialized', () => {
    const d = new HuggingFaceDriver({ auth: { apiKey: 'test' } })
    d.client = null
    assert.throws(() => d.requireClient(), /Hugging Face API client is not initialized/)
  })
})