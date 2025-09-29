export default {
	name: "together",
	url: "https://www.together.ai/pricing#inference",
	models: [
		{ $default: { options: { temperature: 0.2, top_p: 0.9 } } },
		{ name: "deepseek-ai/DeepSeek-V3", cost: 1.25, maxTokens: 131_072, options: { temperature: 0.3, top_p: 0.95 } },
		/**
		 * @note
		 * ❗️max_tokens issue
		 */
		{ name: "Qwen/Qwen2.5-Coder-32B-Instruct", cost: 0.8, maxTokens: 16_000, maxTokensOfficial: 16_384 },
		/**
		 * @note
		 * [top_p = 0.9]
		 * ❗️[temperature = 0.0] Removed some functions, removed imports.
		 * ❗️[temperature = 0.1] Removed some functions, removed imports.
		 * ❗️ Requires license for transformes/tokenizer usage.
		 */
		{ name: "meta-llama/Llama-4-Scout-17B-16E-Instruct", costIn: 0.18, costOut: 0.59, maxTokens: 1_048_576 },
		/**
		 * @note
		 * [top_p = 0.9]
		 * ❗️[temperature = 0.0] Removed imports. 261.431 T/s
		 */
		{ name: "meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8", costIn: 0.27, costOut: 0.85, maxTokens: 1_048_576 },
		/**
		 * @note
		 * ❗️ CHANGELOG => low quality, but correct.
		 */
		{ name: "Qwen/Qwen2.5-7B-Instruct", cost: 0.20, maxTokens: 32_000, maxTokensOfficial: 32_768 },
	]
}
