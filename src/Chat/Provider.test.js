import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Provider from './Provider.js'

const providers = {
  OpenAI: {
    url: 'https://openai.com',
    driver: 'OpenAI',
    auth: { apiKey: '/.keys/openai.key' },
    db: { root: './.llm/db/openai', mount: '/', extension: '.json' }
  },
  HFInference: {
    url: 'https://huggingface.co',
    driver: 'HuggingFace',
    options: { provider: 'hf-inference' }
  },
}

suite('Provider', () => {
  it('should create an empty instance', () => {
    const pro = new Provider()
    assert.ok(pro)
  })
  
  it('should create an instance from object', () => {
    const pro = new Provider({ ...providers.OpenAI, name: 'OpenAI' })
    assert.ok(pro)
    assert.deepEqual(pro.auth, { apiKey: '/.keys/openai.key' })
    assert.equal(pro.db.mount, '/')
  })
})