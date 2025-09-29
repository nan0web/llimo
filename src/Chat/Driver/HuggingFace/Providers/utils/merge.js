import { createRequire } from 'node:module'
import HuggingFaceProvider from "../../HuggingFaceProvider.js"
const require = createRequire(import.meta.url)

/**
 * @param {HuggingFaceProvider} provider
 * @param {string} jsonFile
 */
export default function merge(provider, jsonFile) {
	const json = require(jsonFile)
	provider.models.forEach(model => {
		const info = json.models.find(m => model.is(m.name))
		if (info) {
			model.features = info.features ?? {}
			model.prices.currency = info.currency ?? "USD"
			model.status = info.status ?? ""
			model.performance = info.performance ?? {}
			model.author = info.author ?? ""
			model.validatedAt = info.validatedAt ?? ""
		}
	})
}
