class SystemRulesFormattingFiles {
	toString() {
		return `
### 3. Formatting files

Use TAB for indents, besided those format where spaces are mandatory such as YAML.

Use \n for end of lines.

Avoid ; at the end of the line for javascript files.

If code provided save the original comments inside /** */.

Write jsdoc (provide @params, @emits, @returns and other standard tags with types and description) for the exported functions in js, jsx files in the format compatible with typescript.

Stick to provided format for the response, including tabs, semicolons, commas, etc.

Chat format: respond only with the changed content (files), if there is no change in the file, just omit it, every file must be complete from beggining till the end, so I can parse it back and save into files and it should work just fine.`
	}
}

export default SystemRulesFormattingFiles
