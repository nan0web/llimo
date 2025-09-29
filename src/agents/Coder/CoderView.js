import { typeOf } from "../../../utils/nano-types"

class Window {
	stdout
	constructor(stdout) {
		this.stdout = stdout
	}
	get width() {
		return this.stdout.getWindowSize()[0]
	}
	get height() {
		return this.stdout.getWindowSize()[1]
	}
}

// @todo I want to make it
function Frame(text) {
	if (typeOf(Array)(text)) {
		return text.map(String)
	}
	return [String(text)]
}

class View {
	/** @type {App} */
	app
	/** @type {Window} */
	window
	/** @type {number} */
	startedAt
	/** @type {string|string[]} */
	prev
	constructor(app, stdout) {
		this.app = app
		this.window = new Window(stdout)
		this.startTimer()
	}
	startTimer() {
		this.startedAt = Date.now()
	}
	get spent() {
		return parseInt((Date.now() - this.startedAt) / 1000)
	}
	format() {
		new Intl.NumberFormat(this.app.locale).format
	}
	/**
	 * @param {string|string[]} value
	 * @returns {string|string[]}
	 */
	render(value, shouldRender = true) {
		if (typeOf(Function)(shouldRender)) {
			return shouldRender(value)
		}
		else if (shouldRender) {
			this.app.output.write(value)
		}
		return value
	}

	progress(shouldRender = false) {
		return (value) => {
			/**
			 * @todo make it work for multiline, in cases:
			 * - value = Text(value)
			 * - if string and length > this.window.width
			 * - if stirng and includes
			 * - if string[]
			 */
			return this.render(value, !!shouldRender)
		}
	}
	/**
	 *
	 * @param {object} param0
	 * @param {ChatMessage} param0.answer
	 * @param {ChatMessage} param0.thoughts
	 * @param {boolean} [param0.thinking=false]
	 */
	thinking({ answer, thoughts, thinking = false }) {
		return (render = false) => {
			const a = thinking
			const b = !empty(thoughts)
			const c = !empty(answer) && !b
			const [t, w] = [format(thoughts.length), format(answer.length)]

			const rows = [
				a && "Thinking 🤔 (" + t + ")",
				b && "Answering 🧐 (" + t + ") 🎹 (" + w + ")",
				c && "Answering 🎹 (" + w + ")"
			].filter(Boolean).map(
				row => Output.BOL + "💬 " + row
			)
			return this.render(rows, render)
		}
	}
	welcome({ cwd }) {
		return (render = false) => {
			const rows = [
				"", "NaN•Chat[er] is ready to help you", "",
				"Current directory is: " + cwd,
				"Control files:",
				"", " User files:", "",
				" - me.md             - Write your [prompt] here to let NaN•Chat[er] understand it is complete end it with \\n#.",
				"", " System files:", "",
				" - chat/chat.md      - This is the whole chat log. !DO NOT CHANGE!",
				" - chat/prompt.md    - Generated prompt from me.md",
				" - chat/response.md  - Current response from chat",
				" - chat/stream.md    - The output from the assistant",
				"", ".. Waiting for changes in [me.md] (use \\n#. to complete the prompt)",
			]
			return this.render(rows, render)
		}
	}
	chatPreview({ chat }) {
		return (render = false) => {
			const rows = [
				"   size: " + format(chat.size) + " bytes",
			]
			return this.render(rows, render)
		}
	}
	waitingForChanges({ includes, processed, tests }) {
		return (render = false) => {
			const row = [
				Output.BOL +
				"   " + includes.length + " file(s) included, "
				+ "test to run: " + format(tests.length) + ", "
				+ "content size: " + format(processed.length) + " byte(s)"
			].join("")
			return this.render(row, render)
		}
	}
	async ask({ label }) {

	}
	/**
	 * @param {object} context
	 * @param {ChatMessage} context.chat
	 * @param {string|string[]} [context.label="Found existing chat, do you want to continue it?"]
	 * @returns {boolean}
	 */
	async askToContinueWithIncompleteChat(context) {
		const {
			chat,
			label : initialLabel = "Found existing chat, do you want to continue it?"
		} = context
		const label = [
			...(typeOf(Array)(initialLabel) ? initialLabel : [initialLabel]),
			...this.chatPreview({ chat })()
		]
		const ok = await this.ask({ label, options: ["Yes", "Nope"] })
		return oneOf("yes", "y", "yep")(String(ok).toLowerCase())
	}
}

class CoderView extends View {
	waitingForChanges({ includes, processed, tests }) {
		return (render = false) => {
			const row = [
				"   " + includes.length + " file(s) included, "
				+ "test to run: " + format(tests.length) + ", "
				+ "content size: " + format(processed.length) + " byte(s)"
			].join("")
			return this.render(row, this.progress(render))
		}
	}
}

export default CoderView
