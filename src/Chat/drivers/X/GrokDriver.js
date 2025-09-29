import Model from "../../Model.js"
import ChatDriver from "../ChatDriver.js"

/**
 * Driver for xAI Grok API
 */
class GrokDriver extends ChatDriver {
	static DEFAULT_MODEL = "grok-3-mini"
	static DEFAULT_ENDPOINT = "https://api.x.ai/v1/chat/completions"
	static MODELS = {
		grok_3: Model.from({
			name: "grok-3",
			maxContext: 131_072, maxInput: 131_072, maxOutput: 131_072,
			costIn: 3.00, costOut: 15.00, currency: "USD",
			rpm: [100],
			tpm: [13_107_200],
			bql: [0],
		}),
		grok_3_fast: Model.from({
			name: "grok-3-fast",
			maxContext: 131_072, maxInput: 131_072, maxOutput: 131_072,
			costIn: 5.00, costOut: 25.00, currency: "USD",
			rpm: [100],
			tpm: [13_107_200],
			bql: [0],
		}),
		grok_3_mini: Model.from({
			name: "grok-3-mini",
			maxContext: 131_072, maxInput: 131_072, maxOutput: 131_072,
			costIn: 0.30, costOut: 0.50, currency: "USD",
			rpm: [100],
			tpm: [13_107_200],
			bql: [0],
		}),
		grok_3_mini_fast: Model.from({
			name: "grok-3-mini-fast",
			maxContext: 131_072, maxInput: 131_072, maxOutput: 131_072,
			costIn: 0.60, costOut: 4.00, currency: "USD",
			rpm: [100],
			tpm: [13_107_200],
			bql: [0],
		}),
		grok_manual: Model.from({
			name: "grok-3-manual",
			maxContext: 131_072, maxInput: 131_072, maxOutput: 131_072,
			costIn: 0, costOut: 0, currency: "USD",
			rpm: [100],
			tpm: [13_107_200],
			bql: [0],
			manual: true,
		})
	}

	/**
	 * Processes text by removing artifacts
	 * @param {string} text Input text
	 * @returns {string} Processed text
	 */
	processText(text) {
		const rows = text.split('\n')
		const result = []
		let artifact = null
		for (const row of rows) {
			if (row.startsWith('<xaiArtifact')) {
				artifact = row
			} else if (null !== artifact) {
				if (row.startsWith('</xaiArtifact>') || row.endsWith('</xaiArtifact>')) {
					artifact = null
				} else {
					artifact += '\n' + row
				}
			} else {
				result.push(row)
			}
		}
		return result.join('\n')
	}
}

export default GrokDriver
