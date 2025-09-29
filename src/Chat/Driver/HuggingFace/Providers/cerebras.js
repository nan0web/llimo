import HuggingFaceProvider from "../HuggingFaceProvider.js"
import merge from "./utils/merge.js"
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const jsonFile = resolve(fileURLToPath(import.meta.url), "../cerebras.json")

/**
 * @example
 * ```bash
 * nan0chat -provider HFCerebras -model Qwen3-32B
 * ```
 */
const provider = new HuggingFaceProvider({
	name: "cerebras",
	url: "https://www.cerebras.ai/",
	models: [
		{
			name: "Qwen/Qwen3-32B", provider: "cerebras",
			context: { window: 99_840, output: 25_000 },
			prices: { i: 0.40, o: 0.80, speed: 2_600 },
			input: ["text"], output: ["text"]
		},
		{
			name: "Qwen/Qwen3-Coder-480B-A35B-Instruct", provider: "cerebras",
			context: { window: 131_072, output: 25_000 },
			prices: { i: 0.60, o: 1.20, speed: 2_600 },
			input: ["text"], output: ["text"]
		},
		{
			name: "deepseek-ai/DeepSeek-R1-Distill-Llama-70B", provider: "cerebras",
			context: { window: 99_840, output: 25_000 },
			prices: { i: 2.20, o: 2.50, speed: 2_600 },
			input: ["text"], output: ["text"]
		}
	]
})

merge(provider, jsonFile)

export default provider
