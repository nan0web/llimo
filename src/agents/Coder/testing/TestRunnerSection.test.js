import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import { to } from '@nan0web/types'
import TestRunnerSection from './TestRunnerSection.js'
import context from './TestRunner.context.js'
import TestRunnerExpect from './TestRunnerExpect.js'

suite('TestRunnerSection', () => {
  for (const [key, value] of Object.entries(context)) {
    it(`should parse sections in ${key}`, () => {
      const target = value
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
      
      const sections = TestRunnerSection.parseAll(lines)
      const exp = TestRunnerExpect.parseSections(sections)
      assert.deepEqual(to(Object)(ctx), to(Object)(exp))
    })
  }
})