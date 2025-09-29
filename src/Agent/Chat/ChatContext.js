import ChatAgent from "./ChatAgent.js"
import ChatMessage from "../../Chat/Message.js"
import ChatModel from "../../Chat/Model.js"
import ChatProvider from "../../Chat/Provider.js"
import ChatResponse from "../../Chat/Response.js"

export default class ChatContext {
	/** @type {string} */
	cwd = "."
	/** @type {ChatModel} */
	model = new ChatModel()
	/** @type {ChatProvider} */
	provider = new ChatProvider()
	/** @type {ChatAgent} */
	agent = new ChatAgent()
	/** @type {ChatMessage} */
	chat = new ChatMessage()
	/** @type {ChatResponse} */
	prevResponse = new ChatResponse("")
	/** @type {string} */
	inputFile = "me.md"
	/** @type {string} */
	chatFile = "chat/chat.md"
	/** @type {string} */
	promptFile = "chat/prompt.md"
	/** @type {string} */
	responseFile = "chat/response.md"
	/** @type {string} */
	streamFile = "chat/stream.md"
	#loopCount = 0
	/** @type {boolean} */
	cancelled = false

	get loopCount() {
		return this.#loopCount
	}

	set loopCount(value) {
		this.#loopCount = Number(value)
	}

	/**
	 * @param {Object} input
	 * @param {string} [input.cwd]
	 * @param {ChatModel} [input.model]
	 * @param {ChatProvider} [input.provider]
	 * @param {ChatAgent} [input.agent]
	 * @param {ChatMessage} [input.chat]
	 * @param {ChatResponse} [input.prevResponse]
	 * @param {string} [input.inputFile]
	 * @param {string} [input.chatFile]
	 * @param {string} [input.promptFile]
	 * @param {string} [input.responseFile]
	 * @param {string} [input.streamFile]
	 * @param {number} [input.loopCount]
	 * @param {boolean} [input.cancelled]
	 */
	constructor(input = {}) {
		const {
			cwd = ".",
			model = this.model,
			provider = this.provider,
			agent = this.agent,
			chat = this.chat,
			prevResponse = this.prevResponse,
			inputFile = this.inputFile,
			chatFile = this.chatFile,
			promptFile = this.promptFile,
			responseFile = this.responseFile,
			streamFile = this.streamFile,
			loopCount = 0,
			cancelled = false,
		} = input
		this.cwd = String(cwd)
		this.model = ChatModel.from(model)
		this.provider = ChatProvider.from(provider)
		this.agent = ChatAgent.from(agent)
		this.chat = ChatMessage.from(chat)
		this.prevResponse = ChatResponse.from(prevResponse)
		this.inputFile = String(inputFile)
		this.chatFile = String(chatFile)
		this.promptFile = String(promptFile)
		this.responseFile = String(responseFile)
		this.streamFile = String(streamFile)
		this.loopCount = Number(loopCount)
		this.cancelled = Boolean(cancelled)
	}

	setResponse(response) {
		this.chat.add(response)
		this.prevResponse = response
		this.loopCount = this.loopCount + 1
	}

	get history() {
		return this.chat.flat()
	}
}