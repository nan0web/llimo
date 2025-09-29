export default {
	name: "hf-inference",
	url: "https://huggingface.co/",
	models: [
		{ $default: { provider: "hf-inference", cost: 0.099, options: { temperature: 0.2, top_p: 0.9 } } },
		/**
		 * @note
		 * [top_p=0.9]
		 * ❗️[temperature=0.0] Incomplete response, lost ) in the exression.
		 */
		{ name: "Qwen/Qwen3-235B-A22B", maxTokens: 40_960, maxTokensOfficial: 99_840 },
		/**
		 * @note
		 */
		{ name: "Qwen/Qwen2.5-Coder-32B-Instruct", maxTokens: 32_768 },
		{ name: "Qwen/Qwen2.5-VL-32B-Instruct", maxTokens: 23_552, maxTokensOfficial: 99_840 },
	]
}
