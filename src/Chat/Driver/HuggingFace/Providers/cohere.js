import HuggingFaceProvider from "../HuggingFaceProvider.js"
import merge from "./utils/merge.js"
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
const jsonFile = resolve(fileURLToPath(import.meta.url), "../cohere.json")

const provider = new HuggingFaceProvider({
	name: "cohere",
	// aya-expanse-32b
	url: "https://cohere.com",
	models: [
		{
			name: "CohereLabs/aya-expanse-32b", provider: "cohere",
			context: { window: 128_000, output: 32_000 },
			prices: { i: 0.01, o: 0.01 },
			input: ["text"], output: ["text"]
		},
		{
			name: "CohereLabs/aya-expanse-8b", provider: "cohere",
			context: { window: 128_000, output: 32_000 },
			prices: { i: 0.01, o: 0.01 },
			input: ["text"], output: ["text"]
		},
		{
			name: "CohereLabs/c4ai-command-r-plus", provider: "cohere",
			context: { window: 128_000, output: 32_000 },
			prices: { i: 0.01, o: 0.01 },
			input: ["text"], output: ["text"]
		}
	]
})

merge(provider, jsonFile)

export default provider
