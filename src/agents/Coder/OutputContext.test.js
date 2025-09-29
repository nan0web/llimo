import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import OutputContext from './OutputContext.js'

/**
 * @todo move to @nan0web/app (@nan0web/app-llm)
 */
import CommandArgs from '../../../../apps/core/src/io/messages/input/CommandArgs.js'
import CommandOptions from '../../../../apps/core/src/io/messages/input/CommandOptions.js'

suite('OutputContext', () => {
  it('should stringify properly', () => {
    const context = new OutputContext({
      cwd: '.',
      files: [
        { file: 'a.json', content: 'A content' },
        { file: 'README.md', content: '# README' }
      ],
      commands: [
        {
          args: new CommandArgs(), opts: new CommandOptions(),
          command: 'bash', type: 'bash',
          content: 'ls -lah\n\ncp a.json b.js',
          value: 'ls -lah\n\ncp a.json b.js',
        }
      ],
      tests: [
        'a.test.js', 'b.test.js'
      ]
    })
    
    const expected = [
      'cwd        = .',
      'files[]    = a.json',
      '             README.md',
      'commands[] = bash',
      'tests[]    = a.test.js',
      '             b.test.js',
    ].join('\n')
    
    assert.equal(String(context), expected)
  })
})