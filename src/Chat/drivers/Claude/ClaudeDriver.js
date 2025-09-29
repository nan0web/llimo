import Model from "../../Model.js"
import ChatDriver from "../ChatDriver.js"

/**
 * Driver for Anthropic Claude API
 */
class ClaudeDriver extends ChatDriver {
	static DEFAULT_MODEL = "claude-opus-4-20250514"
	static DEFAULT_ENDPOINT = "https://api.anthropic.com/v1/messages"
	static BATCH_ENDPOINT = "https://api.anthropic.com/v1/messages/batches"
	static MODELS = {
		claude_opus_4: Model.from({
			name: "claude-opus-4-0",
			at: '20250514',
			maxContext: 200_000, maxOutput: 200_000,
			costIn: 15, costOut: 75, currency: "USD",
			rpm: [1_000],
			tpm: [1_000_000],
			bql: [1_000_000],
			batchDiscount: '50%'
		}),
		claude_sonnet_4: Model.from({
			name: "claude-sonnet-4-0",
			at: '20250514',
			maxContext: 200_000, maxOutput: 200_000,
			costIn: 3.00, costOut: 15.00, currency: "USD",
			rpm: [1_000],
			tpm: [1_000_000],
			bql: [1_000_000],
			batchDiscount: '50%'
		}),
		claude_haiku_3_5: Model.from({
			name: "claude-3-5-haiku-latest",
			at: '20241022',
			maxContext: 200_000, maxOutput: 200_000,
			costIn: 0.80, costOut: 4.00, currency: "USD",
			rpm: [1_000],
			tpm: [1_000_000],
			bql: [1_000_000],
			batchDiscount: '50%'
		}),
	}

	/**
	 * Gets authorization headers
	 * @returns {object} Headers object
	 */
	_authHeader() {
		return {
			'X-Api-Key': this.config.auth.apiKey,
		}
	}
}

export default ClaudeDriver
