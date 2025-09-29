import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import Coder from './Coder.js'
import ChatMessage from '../../../../apps/core/src/io/ChatMessage.js'

const __dirname = resolve(fileURLToPath(import.meta.url), '..')
const cwd = process.cwd()

suite('system.md tests', () => {
  it('should decode rule headers', () => {
    const decodeRule = (row) => {
      const [id, ..._] = row.slice('### '.length).trim().split('. ')
      const name = _.join('. ')
      return { id, name }
    }

    assert.deepEqual(decodeRule('### 1. First rule'), { id: '1', name: 'First rule' })
    assert.deepEqual(decodeRule('### 2. 2nd. rule'), { id: '2', name: '2nd. rule' })
    assert.deepEqual(decodeRule('### 2.1. Something more'), { id: '2.1', name: 'Something more' })
    assert.deepEqual(decodeRule('### First rule'), { id: 'First rule', name: '' })
    assert.deepEqual(decodeRule('### 1.First rule'), { id: '1.First rule', name: '' })
    assert.deepEqual(decodeRule('###'), { id: '', name: '' })
  })
})

suite('Coder', () => {
  const agent = new Coder()

  it('should normalize escaped content', () => {
    const raw = [
      '# NaN•CLi\n',
      'The new era of CLI',
      '---#### `.:bash`---',
      '```bash',
      '# [get]',
      'echo "Escaped line:"\n',
      '---```---',
    ].join('\n')
    
    const expected = [
      '# NaN•CLi\n',
      'The new era of CLI',
      '#### `.:bash`',
      '```bash',
      '# [get]',
      'echo "Escaped line:"\n',
      '```'
    ].join('\n')
    
    assert.equal(agent.normalizeEscapedContent(raw), expected)
  })

  it('should parse files and commands', () => {
    const content = [
      '#### `./file.js`',
      '```js',
      'const x = 5',
      '```',
      '',
      '#### `.:bash`',
      '```bash',
      'ls .',
      '```'
    ].join('\n')
    
    const { files, commands } = agent.parse(content)
    assert.equal(files.length, 1)
    assert.equal(files[0].file, './file.js')
    assert.equal(commands.length, 1)
    assert.equal(commands[0].command, 'bash')
  })

  it('should parse complex block structure', () => {
    const content = [
      '#### `./a.js`',
      '```js',
      'const a = 1',
      '```',
      '',
      '#### `.:need`',
      '```md',
      '*GeminiDriver*.js',
      'test/00-README.md.js',
      '```',
      '',
      '#### `.:task`',
      '```md',
      'COMPLETE',
      'Already done',
      '```'
    ].join('\n')

    const { files, requests, messages } = agent.parseBlocks(content)
    assert.equal(files.length, 1)
    assert.deepEqual(requests, ['*GeminiDriver*.js', 'test/00-README.md.js'])
    assert.equal(messages[0].status, 'COMPLETE')
    assert.ok(messages[0].text.includes('Already done'))
  })
})