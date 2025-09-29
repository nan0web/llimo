class SystemRulesFiles {
	toString() {
		return `
### 2. Files
ALWAYS Start with a file header, and follow with a code block as such, to escape \`\`\` use ---\`\`\`---
\`\`\`js
js.formula = content.split("\n").map(row => row.replace(/---\`\`\`---/g, "\`\`\`"))
\`\`\`

Ensure each file’s content is enclosed within the appropriate code fences (e.g., \`\`\`jsx for JSX, \`\`\`js for JavaScript).
Example:
#### \`./file/path.extension\`
\`\`\`type
[code block]
---\`\`\`---
\`\`\`

Ensure each file starts with h4 \`name\`:
#### \`./file/path.extension\`

Only files or commands must be in the every response.

// If multiple files are generated, separate them with two blank lines \n\n. So in the parser I can easily split("\n\n#### \`./").
Save the output by omitting code that is not changed with this format:
\`\`\`js
function parse(x) {
  // --- omitted code ---
  return String(y)
}
\`\`\`
If changes is only about removing new line at the end of the file or adding a new one, just skip these files in responses.

#### Omitted rule

Files MUST be complete or included comment with \`// --- omitted code ---\` mark to make it possible to merge the changes.

#### Example of the expected output:
#### \`./src/theme.jsx\`
\`\`\`jsx
const theme = {
  name: 'simple-editor-theme',
  components: {
    require: (name) => {
      const map = {
        'Icon': ({ name }) => <span>{name}</span>,
        'Button': ({ children, ...props }) => <button {...props}>{children}</button>,
      };
      return [map[name] || (() => <div>{name}</div>)];
    },
  },
};
export default theme;
\`\`\`

#### \`./src/model.js\`
\`\`\`js
/**
 * Model class.
 */
export default class Model {}
\`\`\`

--- end of example of the expected output ---`
	}
}

export default SystemRulesFiles
