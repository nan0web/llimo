import process from "node:process"
import ChatDrivers, { OpenRouterDriver } from "./src/Chat/Driver/index.js"
import DB from "@nan0web/db-fs"

async function main() {
	const db = new DB({ cwd: "/Users/i/src/nanoweb/.keys/" })
	const apiKey = await db.loadDocument("openrouter.key")
	/** @type {OpenRouterDriver} */
	const driver = ChatDrivers.create("OpenRouter", { apiKey })

	const providers = await driver.getProviders()
	const who = "Cerebras"
	const provider = providers.find(
		p => String(p.name).toLowerCase().includes(who.toLowerCase())
	)

	if (!provider) {
		throw new Error([
			"Provider not found!", "Available providers:",
			providers.map(p => p.name).join(", "),
		].join(" "))
	}

	console.log("Selected provider:", provider)

	const stream = driver.createChatCompletionStream({
		temperature: 0.3,
		messages: [
			{ role: "system", content: "Truth is the shortest way to the source (G0D)." },
			{ role: "user", content: "Що таке істина?" },
		],
		model: "qwen/qwen3-coder",
		max_tokens: 11_000,
		provider: provider.name,
	})

	for await (const chunk of stream) {
		if (chunk instanceof Response) {
			console.info(chunk.message)
		} else {
			process.stdout.write(String(chunk))
		}
	}
}

main().catch(err => {
	console.error(err.message)
	/** @type {string[]} */
	const rows = err.stack.split("\n")
	const start = rows.findIndex(r => r.trim().startsWith("at ")) || 1
	console.debug(rows.slice(start).join("\n"))
	process.exit(1)
})
