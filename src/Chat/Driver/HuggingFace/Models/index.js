import deepseekR1Qwen38bv4sm from "./ArliAI/DS-R1-Qwen3-8B-ArliAI-RpR-v4-Small.js"

export default {
	"deepseek-r1-qwen3-8b-v4-small": deepseekR1Qwen38bv4sm
}

// export default {
// 	"deepseek-v3": Model.from({
// 		name: "deepseek-ai/DeepSeek-V3",
// 		provider: "together",
// 		maxContext: 131072,
// 		maxOutput: 131072,
// 		costIn: 1.25,
// 		costOut: 1.25,
// 		currency: "USD",
// 		rpm: [1000],
// 		tpm: [1000000]
// 	}),
// 	"deepseek-r1": Model.from({
// 		name: "deepseek-ai/DeepSeek-R1",
// 		provider: "together",
// 		maxContext: 163840,
// 		maxOutput: 163840,
// 		costIn: 3,
// 		costOut: 7,
// 		currency: "USD",
// 		rpm: [1000],
// 		tpm: [1000000]
// 	}),
// 	"qwen3": Model.from({
// 		name: "Qwen/Qwen3-235B-A22B-FP8",
// 		/**
// 		 * @link https://www.together.ai/pricing#inference
// 		 * true === enable_thinking ? {
// 		 *   temperature: 0.6, top_p: 0.95, top_k: 20, min_p: 0
// 		 * } : {
// 		 *   temperature: 0.7, top_p: 0.8, top_k: 20, min_p: 0
// 		 * }
// 		 */
// 		provider: "together",
// 		maxContext: 40960,
// 		maxOutput: 40960,
// 		costIn: 0.20,
// 		costOut: 0.60,
// 		currency: "USD",
// 		rpm: [1000],
// 		tpm: [1000000]
// 	}),
// 	"qwen-7b": Model.from({
// 		name: "Qwen/Qwen2.5-Coder-7B-Instruct",
// 		provider: "huggingface",
// 		maxContext: 32000,
// 		maxOutput: 32000,
// 		costIn: 9,
// 		costOut: 9,
// 		currency: "USD",
// 		rpm: [500],
// 		tpm: [500000]
// 	}),
// }
