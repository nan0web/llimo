import crypto from "node:crypto"
import ChatDriver from "../ChatDriver.js"
import Model from "../../Model.js"
import Prompt from "../../Prompt.js"
import DeepSeekCoderResponse from "../DeepSeekCoder/Response.js"

/**
 * Driver for DeepSeek Coder API
 */
class DeepSeekCoderDriver extends ChatDriver {
    static Prompt = Prompt
	static Response = DeepSeekCoderResponse
    static DEFAULT_MODEL = "deepseek-coder-v2-lite-instruct"
    static DEFAULT_ENDPOINT = "https://api.deepseek.com/v1"
    static MODELS = {
        "deepseek-coder-v2-lite-instruct": Model.from({
            name: "deepseek-ai/DeepSeek-Coder-V2-Lite-Instruct",
            maxContext: 128000,
            maxOutput: 128000,
            costIn: 0,
            costOut: 0,
            currency: "USD",
            rpm: [1000, 2000, 5000],
            rpd: [10000, 50000, 100000],
            tpm: [1000000, 2000000, 5000000]
        }),
        "deepseek-coder-v2-instruct": Model.from({
            name: "deepseek-ai/DeepSeek-Coder-V2-Instruct",
            maxContext: 128000,
            maxOutput: 128000,
            costIn: 0,
            costOut: 0,
            currency: "USD",
            rpm: [500, 1000, 2000],
            rpd: [5000, 20000, 50000],
            tpm: [500000, 1000000, 2000000]
        })
    }

    /**
     * Gets authorization headers
     * @returns {object} Headers object
     * @throws {Error} If API key is missing
     */
    _authHeader() {
        if (this.constructor.IGNORE_AUTH) return {}
        if (!this.config.auth?.apiKey) {
            throw new Error("DeepSeek API key is required")
        }
        return {
            'Authorization': `Bearer ${this.config.auth.apiKey}`,
        }
    }

    /**
     * Prepares chat completion request
     * @param {Prompt|function} prompt Prompt or function
     * @returns {object} Request options
     */
    _chatCompletionRequest(prompt) {
        const endpoint = this._chatCompletionEndpoint()
        prompt = this._decodePrompt(prompt)

        const data = {
            model: this.config.model || this.constructor.DEFAULT_MODEL,
            messages: prompt.toArray(),
            temperature: 0.3,
            max_tokens: 4096,
            ...(this.config?.chat?.args || {})
        }

        return {
            endpoint,
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                ...this._authHeader(),
            },
            body: JSON.stringify(data)
        }
    }

    /**
     * Parses completion response
     * @param {object} res API response
     * @returns {object} Parsed data
     * @throws {Error} On parse failure
     */
    async _parseChatCompletionResponse(res) {
        try {
            const data = await res.json()

            if (data.error) {
                throw new Error(data.error.message)
            }

            if (data.choices && data.choices[0]) {
                return {
                    ...data,
                    content: data.choices[0].message.content,
                    finish_reason: data.choices[0].finish_reason
                }
            }

            return data
        } catch (err) {
            const text = await res.text()
            throw new Error(`Failed to parse response: ${text}`)
        }
    }

    /**
     * Extracts files from response
     * @param {Response} response Response object
     * @returns {object} Files dictionary
     */
    extractFiles(response) {
        return this.readCodeResponse(response.content)
    }

    /**
     * Reads code blocks from text
     * @param {string} text Input text
     * @returns {object} Files dictionary
     */
    readCodeResponse(text) {
        const files = {}
        const codeBlocks = text.match(/```[\s\S]*?\n([\s\S]*?)\n```/g) || []

        for (const block of codeBlocks) {
            const [firstLine, ...contentLines] = block.split('\n')
            const language = firstLine.replace(/```/, '').trim()
            const content = contentLines.slice(0, -1).join('\n')

            if (language && content) {
                const fileName = `${language}-${crypto.randomBytes(2).toString('hex')}.${language}`
                files[fileName] = {
                    type: language,
                    data: content
                }
            }
        }

        return files
    }
}

export default DeepSeekCoderDriver
