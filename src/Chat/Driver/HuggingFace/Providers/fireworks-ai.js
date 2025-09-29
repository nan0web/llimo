export default {
	name: "fireworks-ai",
	url: "https://fireworks.ai/pricing#serverless-pricing",
	models: [
		{ $default: { provider: "fireworks-ai", cost: 0.099, options: { temperature: 0.2, top_p: 0.9 } } },
		/**
		 * @note
		 */
		{ name: "Qwen/Qwen2.5-VL-32B-Instruct", maxTokens: 128_000 },
		/**
		 * @note
		 * ❗️MODEL NOT FOUND or NOT DEPLOYED
		 */
		{ name: "Qwen/Qwen3-8B", costIn: 9.99, costOut: 9.99, maxTokens: 99_840 },
	]
}
