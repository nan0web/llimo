class SystemRulesVitest {
	toString() {
		return `
Every component, model or exported function must wrapped with test \`vitest\`. The related tests must be siblings of the sources \`./src/models/App.js\` => \`./src/models/App.test.js\`, for jsx files tests must be .jsx \`./src/components/Help.jsx\` => \`./src/components/Help.test.jsx\`.`
	}
}

export default SystemRulesVitest
