import ChatAgent from "../Agent/Chat/ChatAgent.js"
import ChatMessage from "./Message.js"
import ChatModel from "./Model/Model.js"
import ChatProvider from "./Provider.js"
import ChatResponse from "./Response.js"

export default class ChatContext {
	/** @type {string} */
	cwd = "."
	/** @type {ChatModel} */
	model = new ChatModel()
	/** @type {ChatProvider | undefined} */
	provider
	/** @type {ChatAgent} */
	agent
	/** @type {ChatMessage} */
	prompt = new ChatMessage()
	/** @type {ChatMessage} */
	chat = new ChatMessage()
	/** @type {ChatResponse} */
	prevResponse = new ChatResponse("")
	/** @type {string} */
	input = ""
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

	#cancelled = false

	/**
	 * @param {Object} props
	 * @param {string} [props.cwd]
	 * @param {ChatModel} [props.model]
	 * @param {ChatProvider} [props.provider]
	 * @param {ChatAgent} props.agent
	 * @param {ChatMessage} [props.prompt]
	 * @param {ChatMessage} [props.chat]
	 * @param {ChatResponse} [props.prevResponse]
	 * @param {string} [props.input]
	 * @param {string} [props.inputFile]
	 * @param {string} [props.chatFile]
	 * @param {string} [props.promptFile]
	 * @param {string} [props.responseFile]
	 * @param {string} [props.streamFile]
	 * @param {boolean} [props.cancelled]
	 */
	constructor(props) {
		const {
			cwd = ".",
			model = this.model,
			provider = this.provider,
			agent,
			chat = this.chat,
			prompt = this.prompt,
			prevResponse = this.prevResponse,
			input = this.input,
			inputFile = this.inputFile,
			chatFile = this.chatFile,
			promptFile = this.promptFile,
			responseFile = this.responseFile,
			streamFile = this.streamFile,
			cancelled = false,
		} = props
		this.cwd = String(cwd)
		this.model = ChatModel.from(model)
		this.provider = provider ? ChatProvider.from(provider) : undefined
		this.agent = ChatAgent.from(agent)
		this.chat = ChatMessage.from(chat)
		this.prompt = ChatMessage.from(prompt)
		this.prevResponse = ChatResponse.from(prevResponse)
		this.input = String(input)
		this.inputFile = String(inputFile)
		this.chatFile = String(chatFile)
		this.promptFile = String(promptFile)
		this.responseFile = String(responseFile)
		this.streamFile = String(streamFile)
		this.#cancelled = Boolean(cancelled)
	}

	/** @returns {number} */
	get loopCount() {
		const messages = this.chat.flat()
		return messages.filter(m => ChatMessage.ROLES.assistant === m.role).length
	}

	get cancelled() {
		return this.#cancelled
	}

	cancel() {
		this.#cancelled = true
	}
}
