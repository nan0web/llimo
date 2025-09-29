import { Data } from "@nan0web/db"
import Model from "../../Model.js"

const $default = {
	prices: { currency: "USD", batchDiscount: 0.5 },
	features: {
		chatCompletions: true, assistants: true
	}
}
const config = {
	"gpt-4.1": {
		prices: { i: 2.00, db: 0.50, o: 8.00, speed: 3 },
		// costIn: 2.00, costOut: 8.00, costCache: 0.50, speed: 3,
		input: ["text", "image"], output: ["text"],
		context: { window: 1_047_576, output: 32_768, date: "2024-06-01" },
	},
	"gpt-4.1-mini": {
		prices: { i: 0.40, db: 0.10, o: 1.60, speed: 4 },
		// costIn: 0.40, costOut: 1.60, costCache: 0.10, speed: 4,
		input: ["text", "image"], output: ["text"],
		context: { window: 1_047_576, output: 32_768, date: "2024-06-01" },
	},
	"gpt-4.1-nano": {
		prices: { i: 0.10, db: 0.0025, o: 0.40, speed: 5 },
		// costIn: 0.10, costOut: 0.40, costCache: 0.0025, speed: 5,
		input: ["text", "image"], output: ["text"],
		context: { window: 1_047_576, output: 32_768, date: "2024-06-01" },
	},
	"gpt-4.5-preview": {
		prices: { i: 75.00, db: 37.50, o: 150, speed: 3 },
		input: ["text", "image"], output: ["text"],
		context: { window: 128_000, output: 16_384, date: "2023-10-01" },
	},
	"gpt-4o": {
		prices: { i: 2.50, db: 1.25, o: 10.00, speed: 3 },
		input: ["text", "image"], output: ["text"],
		context: { window: 128_000, output: 16_384, date: "2023-10-01" },
	},
	"gpt-4o-mini": {
		prices: { i: 0.15, db: 0.0075, o: 0.60, speed: 4 },
		input: ["text", "image"], output: ["text"],
		context: { window: 128_000, output: 16_384, date: "2023-10-01" },
	},
	"o3": {
		prices: { i: 2.00, db: 0.50, o: 8.00, speed: 1 },
		input: ["text", "image"], output: ["text"],
		context: { window: 200_000, output: 100_000, date: "2024-06-01" },
	},
	"o3-pro": {
		prices: { i: 20.00, o: 80.00, speed: 1 },
		input: ["text", "image"], output: ["text"],
		context: { window: 200_000, output: 100_000, date: "2024-06-01" },
		features: {
			chatCompletions: false, assistants: false
		}
	},
	"o3-mini": {
		prices: { i: 1.10, db: 0.55, o: 4.40, speed: 3 },
		input: ["text"], output: ["text"],
		context: { window: 200_000, output: 100_000, date: "2024-06-01" },
	},
	"o1": {
		prices: { i: 15.00, db: 7.50, o: 60, speed: 1 },
		input: ["text", "image"], output: ["text"],
		context: { window: 200_000, output: 100_000, date: "2023-10-01" },
	},
	"o1-pro": {
		prices: { i: 150.00, o: 600, speed: 1 },
		input: ["text", "image"], output: ["text"],
		context: { window: 200_000, output: 100_000, date: "2023-10-01" },
	},
	"o1-mini": {
		prices: { i: 1.10, db: 0.55, o: 4.40, speed: 2 },
		input: ["text"], output: ["text"],
		context: { window: 128_000, output: 65_536, date: "2023-10-01" },
	},
	"o4-mini": {
		prices: { i: 2.00, db: 0.50, o: 8.00, speed: 1 },
		input: ["text", "image"], output: ["text"],
		context: { window: 200_000, output: 100_000, date: "2024-06-01" },
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
