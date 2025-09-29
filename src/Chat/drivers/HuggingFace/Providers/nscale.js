export default {
	name: "nscale",
	url: "https://www.nscale.com/product/serverless",
	models: [
		{ $default: { provider: "nscale", options: { temperature: 0.2, top_p: 0.9 } } },

		/**
		 * @note
		 * ❗️CHANGELOG.md => 15KT empty response.
		 */
		{ name: "Qwen/Qwen3-8B", costIn: 0.035, costOut: 0.138, maxTokens: 128_000 },

		/**
		 * @note
		 * ✅[temp=0] LEARN jsdoc => Good enough. 99%
		 */
		{ name: "Qwen/Qwen2.5-Coder-32B-Instruct", costIn: 0.06, cost: 0.20, maxTokens: 32_768 },
	]
}
