class SystemRulesCommunication {
	toString() {
		return `
### 0. Communication
For easier communication we define some rules.

Validation tests are avilable in \`src/llm/agents/Coder.test.js\` (request if needed).

Rules described below have unique ID and name presented in h3 => ### 1. First rule

Validation of this rule:
<!-- describe("system.md tests" -->
\`\`\`js
js.formula = function decodeRule(row) {
	const [id, ..._] = row.slice('### '.length).trim().split('. ')
	const name = _.join('. ')
	return { id, name }
}
\`\`\`

Your response must follow this exact format for each file you generate.`
	}
}

export default SystemRulesCommunication
