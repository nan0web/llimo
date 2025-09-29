import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { deepMerge } from 'nano-format'
import Model from './Model.js'
import Usage from './Usage.js'

const $default = {
  prices: { currency: 'USD', batchDiscount: 0.5 },
  features: {
    chatCompletions: true, assistants: true
  }
}

const config = {
  'gpt-4.1': {
    prices: { i: 2.00, db: 0.50, o: 8.00, speed: 3 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 1_047_576, output: 32_768, date: '2024-06-01', name: 'gpt-4.1-2025-04-14' },
  },
  'gpt-4.1-mini': {
    prices: { i: 0.40, db: 0.10, o: 1.60, speed: 4 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 1_047_576, output: 32_768, date: '2024-06-01', name: 'gpt-4.1-mini-2025-04-14' },
  },
  'gpt-4.1-nano': {
    prices: { i: 0.10, db: 0.0025, o: 0.40, speed: 5 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 1_047_576, output: 32_768, date: '2024-06-01', name: 'gpt-4.1-nano-2025-04-14' },
  },
  'gpt-4.5-preview': {
    prices: { i: 75.00, db: 37.50, o: 150, speed: 3 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 128_000, output: 16_384, date: '2023-10-01', name: 'gpt-4.5-preview-2025-02-27' },
  },
  'gpt-4o': {
    prices: { i: 2.50, db: 1.25, o: 10.00, speed: 3 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 128_000, output: 16_384, date: '2023-10-01', name: 'gpt-4o-2024-08-06' },
  },
  'gpt-4o-mini': {
    prices: { i: 0.15, db: 0.0075, o: 0.60, speed: 4 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 128_000, output: 16_384, date: '2023-10-01', name: 'gpt-4o-mini-2024-07-18' },
  },
  'o3': {
    prices: { i: 2.00, db: 0.50, o: 8.00, speed: 1 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 200_000, output: 100_000, date: '2024-06-01', name: 'o3-2025-04-16' },
  },
  'o3-pro': {
    prices: { i: 20.00, o: 80.00, speed: 1 },
    input: ['text', 'image'], output: ['text'],
    features: {
      chatCompletions: false, assistants: false
    },
    context: { window: 200_000, output: 100_000, date: '2024-06-01', name: 'o3-pro-2025-06-10' },
  },
  'o3-mini': {
    prices: { i: 1.10, db: 0.55, o: 4.40, speed: 3 },
    input: ['text'], output: ['text'],
    context: { window: 200_000, output: 100_000, date: '2024-06-01', name: 'o3-mini-2025-01-31' },
  },
  'o1': {
    prices: { i: 15.00, db: 7.50, o: 60, speed: 1 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 200_000, output: 100_000, date: '2023-10-01', name: 'o1-2024-12-17' },
  },
  'o1-pro': {
    prices: { i: 150.00, o: 600, speed: 1 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 200_000, output: 100_000, date: '2023-10-01', name: 'o1-pro-2025-03-19' },
  },
  'o1-mini': {
    prices: { i: 1.10, db: 0.55, o: 4.40, speed: 2 },
    input: ['text'], output: ['text'],
    context: { window: 128_000, output: 65_536, date: '2023-10-01', name: 'o1-mini-2024-09-12' },
  },
  'o4-mini': {
    prices: { i: 2.00, db: 0.50, o: 8.00, speed: 1 },
    input: ['text', 'image'], output: ['text'],
    context: { window: 200_000, output: 100_000, date: '2024-06-01', name: 'o4-mini-2025-04-16' },
  },
}

const models = Object.fromEntries(
  Object.entries(config).map(([name, props]) => (
    [name, Model.from({ ...deepMerge($default, props), name })]
  ))
)

suite('Model', () => {
  const usage = Usage.from({
    prompt_tokens: 100,
    completion_tokens: 200,
    cached_tokens: 300,
  })

  for (const [name, model] of Object.entries(models)) {
    it(`should load model ${name}`, () => {
      const orig = config[model.name]
      assert.ok(model)
      assert.equal(model.context.window, orig.context.window)
      assert.equal(model.context.output, orig.context.output)
      assert.equal(model.context.input, orig.context.window - orig.context.output)
      assert.equal(model.context.date, orig.context.date)
      assert.equal(model.prices.input, orig.prices.i)
      assert.equal(model.prices.output, orig.prices.o)
      assert.equal(model.prices.speed, orig.prices.speed)
      assert.equal(model.prices.batchDiscount, $default.prices.batchDiscount)
      assert.equal(model.prices.currency, $default.prices.currency)
      assert.deepEqual(model.input, orig.input)
      assert.deepEqual(model.output, orig.output)
      assert.equal(model.features.chatCompletions, orig.features?.chatCompletions ?? $default.features.chatCompletions)
      assert.equal(model.features.assistants, orig.features?.assistants ?? $default.features.assistants)
      
      const expectedToString = [
        model.name,
        ' ($', model.prices.input.toFixed(2),
        ' $', model.prices.output.toFixed(2),
        ' 1MT)'
      ].join('')
      assert.equal(String(model), expectedToString)
      
      const expectedCost = (
        orig.prices.i * usage.prompt_tokens +
        (orig.prices.db ? orig.prices.db * usage.cached_tokens : 0) +
        orig.prices.o * usage.completion_tokens
      ) / 10 ** 6
      assert.closeTo(model.calc(usage), expectedCost, 0.000001)
    })
  }

  const fakePrices = { input: 5, output: 10, cache: 0 }
  const fakeContext = { window: 4096, output: 512 }
  const fakeFeatures = {}

  it('constructs and formats toString', () => {
    const model = new Model({
      name: 'gpt-test',
      provider: 'openai',
      prices: fakePrices,
      context: fakeContext,
      features: fakeFeatures,
      input: ['text', 'image', 'audio'],
      output: ['text'],
    })

    assert.equal(model.name, 'gpt-test')
    assert.deepEqual(model.input, ['text', 'image'])
    assert.deepEqual(model.output, ['text'])
    assert.ok(String(model).includes('@openai'))
  })

  it('calculates cost from Usage', () => {
    const model = new Model({
      name: 'test',
      prices: { input: 10, output: 20, cache: 5 },
      context: fakeContext,
      features: fakeFeatures
    })
    const usage = new Usage()
    usage.prompt_tokens = 1000
    usage.completion_tokens = 500
    usage.cached_tokens = 300

    model.calc(usage)
    assert.closeTo(usage.cost, (10*1000 + 20*500 + 5*300)/1e6, 0.000001)
  })
})