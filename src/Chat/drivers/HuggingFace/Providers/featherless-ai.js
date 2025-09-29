export default {
	name: "featherless-ai",
	url: "https://featherless.ai/#pricing",
	costIn: 9.99, costOut: 9.99,
	models: [
		/**
		 * @note
		 * ❗️ CHANGELOG => 15KT very slow, busy.
		 */
		{ name: "Qwen/Qwen2.5-14B-Instruct", cost: 9.99, maxTokens: 99_840 },
		/**
		 * @note
		 * ❗️ CHANGELOG => very slow, busy.
		 */
		{ name: "Qwen/Qwen2.5-14B-Instruct-1M", cost: 9.99, maxTokens: 99_840 },
		/**
		 * @note
		 * ❗️CHANGELOG.md => 15KT, very slow, busy (2025-06-26)
		 */
		{ name: "Qwen/Qwen3-8B", costIn: 9.99, costOut: 9.99, maxTokens: 99_840 },
		// "Qwen/Qwen2.5-7B-Instruct",
		// "ArliAI/DS-R1-Qwen3-8B-ArliAI-RpR-v4-Small",
		/**
		 * @note
		 * ❗️ CHANGELOG => very slow, busy.
		 */
		{ name: "Qwen/Qwen2.5-Coder-32B-Instruct", costIn: 9.99, costOut: 9.99, maxTokens: 32_768 }
	]
}
