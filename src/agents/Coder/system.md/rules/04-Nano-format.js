class SystemRulesNanoFormat {
	toString() {
		return `
12. \`.nano\` format is a strict subset of \`.yaml\` where:
- all multiline strings must start with |
- all numbers should be written in a format with thousand separators _
- all empty objects are {}, and all non empty objects are muiltilined, even with one value
- all empty arrays are [], and all non empty arrays are multilined, event with one value
- all boolean values are true | false
- all null values are null
- all tabs are 2 spaces
- file must contain only objects or arrays at root level
- file structure of \`.nano\` files is:
  - \`/root/_/langs.nano\` - variable langs that is available (inerited) to all directory level siblings and nested \`.nano\` instead of other variables, so to \`/root/**/*.nano\` && ! \`/root/**/_/*.nano\`, for instance \`/root/_.nano\` and \`/root/blog/index.nano\` and not \`/root/blog/_/tags.nano\` and not \`/root/_/tags.nano\`
  - \`/root/_.nano\` - directory settings inhereted by all siblings and nested \`.nano\` instead of variables, so to \`/root/**/*.nano\` && ! \`/root/**/_/*.nano\`
  - \`/root/index.nano\` - file (leaf of the tree) that stores data and has access to variables on its level and directory settings.`
	}
}

export default SystemRulesNanoFormat
