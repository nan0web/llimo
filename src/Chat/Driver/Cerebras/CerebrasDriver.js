import Cerebras from '@cerebras/cerebras_cloud_sdk'
import CerebrasModels from "./models.js"
import OpenAIDriver from '../OpenAI/OpenAIDriver.js'

class CerebrasDriver extends OpenAIDriver {
	static DEFAULT_ENDPOINT = "https://api.cerebras.ai/v1"
	static DEFAULT_MODEL = "gpt-oss-120b"
	static MODELS = CerebrasModels

	/** @type {Cerebras} */
	// @ts-ignorep
	api

	constructor(input) {
		super(input)
		this.api = new Cerebras({ apiKey: this.auth?.apiKey })
	}

	async getModels() {
		return Object.values(CerebrasModels)
	}

	async getModel(modelId) {
		return CerebrasModels[modelId]
	}

	async requireDb() {
		if (!this.db) {
			throw new Error("Cerebras API for getting usage is missing.\nSetup your local NANODb to store usage statistics.")
		}
		return await super.requireDb()
	}
}

export default CerebrasDriver
