import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import TestRunner from './TestRunner.js'
import context from './TestRunner.context.js'
import TestRunnerExpect from './TestRunnerExpect.js'

suite('TestRunner (incremental)', () => {
  describe('basic', () => {
    const runner = new TestRunner(process.cwd())
    const total = new TestRunnerExpect()
    const rows = context.onlyFiles.rows.map((el, i) => ([el.value, el.exp, i]))
    const lines = context.onlyFiles.rows.map((el, i) => el.value)
    
    for (const [line, exp, index] of rows) {
      it(`should test expect ${line} > ${JSON.stringify(exp)}`, () => {
        runner.processLine({ line, index, total, lines })
        assert.deepEqual(exp, total)
      })
    }
  })
  
  describe('all', () => {
    for (const name in context) {
      const testName = name
      it(`beforeEach for ${testName}`, () => {
        // This replaces the beforeEach logic for each test name
        const runner = new TestRunner(process.cwd())
        const target = context[testName]
        const total = new TestRunnerExpect()
        const lines = target.rows.map((el, i) => el.value)
        const ctx = new TestRunnerExpect()
        
        for (const el of target.rows) {
          let { files = [], processedFiles = [], ...rest } = el.exp
          if (ctx.files.length) {
            files = Array.from(new Set([...ctx.files, ...files])).sort()
          }
          if (ctx.processedFiles.length) {
            processedFiles = Array.from(new Set([...ctx.processedFiles, ...processedFiles])).sort()
          }
          Object.assign(ctx, { files, processedFiles, ...rest })
        }
        
        // Individual test cases for rows
        for (let i = 0; i < target.rows.length; i++) {
          const el = target.rows[i]
          it(`should test expect ${testName} > ${el.value}`, () => {
            runner.processLine({ line: el.value, index: i, total, lines })
            const expct = new TestRunnerExpect({ ...ctx })
            assert.deepEqual(total, expct)
          })
        }
      })
    }
  })
})