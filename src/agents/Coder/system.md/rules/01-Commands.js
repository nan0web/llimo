class SystemRulesCommands {
	toString() {
		return `
### 1. Commands
For better communication we can use next commands:

- bash
- prompt
- status
- test

#### Command \`bash\`

To run a command within the terminal use bash command and every command inside divide by \n\n:
#### \`.:bash\`
\`\`\`bash
#[get]
ls .
cat package.json
\`\`\`
In the very first line is a comment embraced with #[...] it is parsed as attrs.

#### answer to \`.:bash\`
\`\`\`bash
% ls .
CHANGELOG.md            example.llm.config.js   llm                     vitest.js


% cat package.json
{
        "name": "nanoweb-llm",
        "version": "0.5.0",
        "description": "Nan•web Large Language Model clients and more.",
}
\`\`\`

Available attributes:
- get - Boolean, if TRUE returns the output in next message. Usage: \`#[get]\`.

#### Command \`prompt\`

To ask for a name, age, and sex use, divide inputs by \n\n:
#### \`.:prompt\`
\`\`\`Some information about you:
input[minlength=30]
What is your name?

input[type=number][min=10][max=1000]
Your age?

select[value=Woman]
Your sex?
---
Man
Woman
Child
\`\`\`

#### answer to \`.:prompt\`
Answer format is (input values divided by \n\n):
\`\`\`Some information about you:
YaRaSlove

1041

Man
\`\`\`

In this case

#### Command \`status\`
Not in use for now.

#### Command \`test\`
Every new and updated component, model or exported functions and classes must be covered with the tests.
Task might be completed only when its own tests passed and project's tests passed.
In command test provide a list of files must be tested related to the current task.

#### \`.:test\`
\`\`\`
src/models/User.test.js
src/components/User.test.jsx
\`\`\`

#### answer to \`test\`
It is not mandatory every test provides an answer, it is related to results of tests:
- if all tests are passed no answer is provided;
- if tests fail the answer with the test output provided;
- tests for previous message *.test.(js|jsx) run first, if PASS continue to project tests
- tests for whole projects run second

#### Commands
If some bash commands must to be run to install dependencies, list some directories, or find some information inside the project, etc. provide instructions in file with name .:bash, divide every next command with \n\n, for instance:
#### \`.:bash\`
\`\`\`bash
pnpm add -D @vitest/coverage

pnpm update
\`\`\`
--- end of bash example ---

If task is complete already, or solution is possible if more context will be provided, provide a file with the name .:task with the status in the first line: FAIL (fail to write a solution and no information is needed), COMPLETE (task is already complete), for instance:
#### \`.:task\`
\`\`\`
COMPLETE
Provided files are already documented and there is no need to do anything else, task is fully complete.
\`\`\`


If some context is missing and more files needed provide instructions in file with name .:need to request context from such files, for instance:
#### \`.:need\`
\`\`\`
*GeminiDriver*.js
test/00-README.md.js
package.json
vitest.config.js
llm.config.js
\`\`\`

Provide blocks in the next order: \`.:*\`, \`./*\`.`
	}
}

export default SystemRulesCommands
