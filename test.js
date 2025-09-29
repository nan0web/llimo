import DB from '@nan0web/db'
import DBFS from '@nan0web/db-fs'
import ReleaserAgent from './src/Agent/Releaser/ReleaserAgent.js'  // шлях з коду
import ReleaserChatContext from './src/Agent/Releaser/ChatContext.js'
import { ChatModel, ChatProvider } from "./src/Chat/index.js"
import App from './src/App.js'

const fs = new DBFS({ root: "tmp/release-test" })
await fs.connect()

const app = new App({
	chatProvider: new ChatProvider({
		name: 'test-provider',
		driver: "Releaser"
	}),
	chatModel: new ChatModel({ name: 'llama3-70b' })
})

const context = new ReleaserChatContext({
	agent: new ReleaserAgent({
		fs,
		db: new DB({ root: "tmp/agent" }),
		app
	}),
})

console.log('🚀 Запускаємо Releaser...')
const result = await context.agent.run(context, {
	maxLoops: 5,
	/**
	 * @param {ReleaserChatContext} ctx
	 * @returns
	 */
	onStepEnd: async (ctx) => {
		console.log(`Крок ${ctx.loopCount}: завдань оброблено ${ctx.tasks.filter(t => t.status === 'done').length}`)
		return ctx.tasks.some(t => !t.isDone())
	}
})

console.log('✅ Результат:', result.response?.content ?? 'Успішно завершено!')
if (result.context.tasks.every(t => t.status === 'done')) {
	console.log('🏆 Реліз v1.0.0 готовий! Чекай коміт і мердж.')
}
