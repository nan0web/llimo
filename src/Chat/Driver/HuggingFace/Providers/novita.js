import Model from "../../../Model/Model.js"
import ModelPrices from "../../../Model/Prices.js"
import HuggingFaceProvider from "../HuggingFaceProvider.js"

/**
 * Columns: Model name, Context, Input Cost, Output Cost
 * @link https://novita.ai/pricing
 */
const officialPrices = `
	baidu/ernie-4.5-vl-28b-a3b	30000	Free	Free
	baidu/ernie-4.5-21B-a3b	120000	Free	Free
	baidu/ernie-4.5-0.3b	120000	Free	Free
	google/gemma-3-1b-it	32768	Free	Free
	qwen/qwen3-4b-fp8	128000	Free	Free
	qwen/qwen2.5-7b-instruct	32000	Free	Free
	meta-llama/llama-3.2-1b-instruct	131000	Free	Free
	deepseek/deepseek-v3-0324	163840	$0.28 /M Tokens	$1.14 /M Tokens
	moonshotai/kimi-k2-instruct	131072	$0.57 /M Tokens	$2.3 /M Tokens
	baidu/ernie-4.5-vl-424b-a47b	123000	$0.42 /M Tokens	$1.25 /M Tokens
	baidu/ernie-4.5-300b-a47b-paddle	123000	$0.28 /M Tokens	$1.1 /M Tokens
	qwen/qwen3-30b-a3b-fp8	40960	$0.1 /M Tokens	$0.45 /M Tokens
	minimaxai/minimax-m1-80k	1000000	$0.55 /M Tokens	$2.2 /M Tokens
	deepseek/deepseek-r1-0528-qwen3-8b	128000	$0.06 /M Tokens	$0.09 /M Tokens
	qwen/qwen3-32b-fp8	40960	$0.1 /M Tokens	$0.45 /M Tokens
	qwen/qwen2.5-vl-72b-instruct	32768	$0.8 /M Tokens	$0.8 /M Tokens
	qwen/qwen3-235b-a22b	40960	$0.2 /M Tokens	$0.8 /M Tokens
	deepseek/deepseek-v3-turbo	64000	$0.4 /M Tokens	$1.3 /M Tokens
	meta-llama/llama-4-maverick-17b-128e-instruct-fp8	1048576	$0.17 /M Tokens	$0.85 /M Tokens
	google/gemma-3-27b-it	32000	$0.119 /M Tokens	$0.2 /M Tokens
	deepseek/deepseek-r1-turbo	64000	$0.7 /M Tokens	$2.5 /M Tokens
	Sao10K/L3-8B-Stheno-v3.2	8192	$0.05 /M Tokens	$0.05 /M Tokens
	gryphe/mythomax-l2-13b	4096	$0.09 /M Tokens	$0.09 /M Tokens
	deepseek/deepseek-prover-v2-671b	160000	$0.7 /M Tokens	$2.5 /M Tokens
	meta-llama/llama-4-scout-17b-16e-instruct	131072	$0.1 /M Tokens	$0.5 /M Tokens
	deepseek/deepseek-r1-distill-llama-8b	32000	$0.04 /M Tokens	$0.04 /M Tokens
	meta-llama/llama-3.1-8b-instruct	16384	$0.02 /M Tokens	$0.05 /M Tokens
	deepseek/deepseek-r1-distill-qwen-14b	64000	$0.15 /M Tokens	$0.15 /M Tokens
	meta-llama/llama-3.3-70b-instruct	131072	$0.13 /M Tokens	$0.39 /M Tokens
	qwen/qwen-2.5-72b-instruct	32000	$0.38 /M Tokens	$0.4 /M Tokens
	mistralai/mistral-nemo	60288	$0.04 /M Tokens	$0.17 /M Tokens
	deepseek/deepseek-r1-distill-qwen-32b	64000	$0.3 /M Tokens	$0.3 /M Tokens
	meta-llama/llama-3-8b-instruct	8192	$0.04 /M Tokens	$0.04 /M Tokens
	microsoft/wizardlm-2-8x22b	65535	$0.62 /M Tokens	$0.62 /M Tokens
	deepseek/deepseek-r1-distill-llama-70b	32000	$0.8 /M Tokens	$0.8 /M Tokens
	mistralai/mistral-7b-instruct	32768	$0.029 /M Tokens	$0.059 /M Tokens
	meta-llama/llama-3-70b-instruct	8192	$0.51 /M Tokens	$0.74 /M Tokens
	nousresearch/hermes-2-pro-llama-3-8b	8192	$0.14 /M Tokens	$0.14 /M Tokens
	sao10k/l3-70b-euryale-v2.1	8192	$1.48 /M Tokens	$1.48 /M Tokens
	cognitivecomputations/dolphin-mixtral-8x22b	16000	$0.9 /M Tokens	$0.9 /M Tokens
	sophosympatheia/midnight-rose-70b	4096	$0.8 /M Tokens	$0.8 /M Tokens
	sao10k/l3-8b-lunaris	8192	$0.05 /M Tokens	$0.05 /M Tokens
	thudm/glm-4.1v-9b-thinking	65536	$0.035 /M Tokens	$0.138 /M Tokens
	qwen/qwen3-8b-fp8	128000	$0.035 /M Tokens	$0.138 /M Tokens
	thudm/glm-4-32b-0414	32000	$0.24 /M Tokens	$0.24 /M Tokens
	meta-llama/llama-3.2-3b-instruct	32768	$0.03 /M Tokens	$0.05 /M Tokens
	sao10k/l31-70b-euryale-v2.2	8192	$1.48 /M Tokens	$1.48 /M Tokens
`

const parsePrice = (str) => {
	if (!str) return -1
	if ("Free" === str) return 0
	const m = str.match(/\$([\d.]+)/)
	if (m) return Number(m[1])
	return -1
}

const parseLine = (line) => {
	const parts = line.split("\t")
	if (parts.length < 4) return null
	const [name, contextStr, inputCostStr, outputCostStr] = parts
	const context = Number(contextStr) || 0
	const inputCost = parsePrice(inputCostStr)
	const outputCost = parsePrice(outputCostStr)
	return { name, context, inputCost, outputCost }
}

const parsePrices = (text) => {
	const lines = text.split("\n").map(line => line.trim()).filter(Boolean)
	const models = []
	for (const line of lines) {
		const parsed = parseLine(line)
		if (parsed) {
			const { name, context, inputCost, outputCost } = parsed
			const prices = new ModelPrices({
				input: inputCost,
				output: outputCost,
				cache: 0,
				batchDiscount: 0,
				speed: 0,
				currency: "USD"
			})
			const model = Model.from({
				name,
				context: {
					window: context,
					output: Math.floor(context * 0.25),
					date: ""
				},
				prices,
				input: ["text"],
				output: ["text"],
				provider: "novita"
			})
			models.push(model)
		}
	}
	return models
}

const models = parsePrices(officialPrices)

export default new HuggingFaceProvider({
	name: "novita",
	url: "https://novita.ai/pricing",
	models
})
