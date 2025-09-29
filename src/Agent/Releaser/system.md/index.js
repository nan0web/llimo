import ReleaserTaskRules from "./rules/01-task.js"
import ReleaserFormatRules from "./rules/02-format.js"

export default [
	new ReleaserTaskRules(),
	new ReleaserFormatRules(),
].join("\n").trim()
