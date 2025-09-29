import { suite, describe, it } from 'node:test'
import assert from 'node:assert/strict'
import Message from './Message.js'

const toStringContext = [
  ['should render with empty toString options', {}, [
    '# system:',
    '# Software developer',
    'I am an expert of a Javascript',
    '',
    '# assistant:',
    'Hello! How can I help you?',
    '',
    '# user:',
    'Hi. Write me a function y.',
    '',
    '# assistant:',
    'const y = x => x ** x',
  ]],
  ['should properly format standard format', { format: true }, [
    'system      :# Software developer',
    '             I am an expert of a Javascript',
    '',
    'assistant @mac:Hello! How can I help you?',
    '',
    'user      @me :Hi. Write me a function y.',
    '',
    'assistant @mac:const y = x => x ** x',
  ]],
  ['should properly format short format', { format: 'short' }, [
    'sys   :# Software developer',
    '       I am an expert of a Javascript',
    '',
    'ass @mac:Hello! How can I help you?',
    '',
    'usr @me :Hi. Write me a function y.',
    '',
    'ass @mac:const y = x => x ** x',
  ]],
  [
    'should properly format with column width format',
    { format: 'short', columns: [6, 4, 20], padding: 2 },
    [
      'sys       :# Software developer',
      '           I am an expert of a ',
      '           Javascript',
      '',
      'ass    @mac :Hello! How can I hel',
      '             p you?',
      '',
      'usr    @me  :Hi. Write me a funct',
      '             ion y.',
      '',
      'ass    @mac :const y = x => x ** ',
      '             x',
    ]
  ]
]

suite('ChatMessage', () => {
  const chat = new Message({ content: '# Software developer\nI am an expert of a Javascript', role: Message.ROLES.system })
  const next = chat.add(new Message({ content: 'Hello! How can I help you?', role: Message.ROLES.assistant, username: 'mac' }))
  const third = next.add(new Message({ content: 'Hi. Write me a function y.', username: 'me' }))
  third.add(new Message({ content: 'const y = x => x ** x', role: Message.ROLES.assistant, username: 'mac' }))

  describe('flat()', () => {
    it('should properly return flat messages', () => {
      const flat = chat.flat()
      assert.equal(flat.length, 4)
    })
  })

  describe('toString()', () => {
    for (const [name, opts, exp] of toStringContext) {
      it(name, () => {
        const rendered = chat.toString(opts).split('\n')
        rendered.forEach((row, i) => assert.equal(row, exp[i]))
      })
    }
  })
})