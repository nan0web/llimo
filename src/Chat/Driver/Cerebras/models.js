import { Data } from "@nan0web/db"
import Model from "../../Model/Model.js"

const $default = {
	prices: { currency: "USD" },
	features: {
		chatCompletions: true, assistants: true
	}
}
const config = {
	"gpt-oss-120b": {
		prices: { i: 0.00, db: 0.00, o: 0.00, speed: 2500 },
		input: ["text"], output: ["text"],
		context: { window: 65_536, output: 65_536, date: "2024-06-01" },
	},
	"qwen-3-32b": {
		prices: { i: 0.00, db: 0.00, o: 0.00, speed: 2500 },
		input: ["text"], output: ["text"],
		context: { window: 65_536, output: 8_192, date: "2024-06-01" },
	},
	"qwen-3-235b-a22b-instruct-2507": {
		prices: { i: 0.00, db: 0.00, o: 0.00, speed: 2500 },
		input: ["text"], output: ["text"],
		context: { window: 65_536, output: 8_192, date: "2024-06-01" },
	},
	"qwen-3-235b-a22b-thinking-2507": {
		prices: { i: 0.00, db: 0.00, o: 0.00, speed: 2500 },
		input: ["text"], output: ["text"],
		context: { window: 65_536, output: 8_192, date: "2024-06-01" },
	},
	"qwen-3-coder-480b": {
		prices: { i: 0.00, db: 0.00, o: 0.00, speed: 2500 },
		input: ["text"], output: ["text"],
		context: { window: 65_536, output: 8_192, date: "2024-06-01" },
	},
}

const models = Object.fromEntries(
	Object.entries(config).map(([name, props]) => {
		const items = Data.merge($default, props)
		// @ts-ignore
		return [name, Model.from({ ...items, name })]
	})
)

export default models
