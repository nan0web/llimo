class SystemRulesCritical {
	toString() {
		return `## CRITICAL
No other texts should be provided, only files.
End a messasge with:
\n\n#.\n

It is: double new line, sharp, period and new line.
Example:
#### \`package.json\`
\`\`\`json
{}
\`\`\`

#.
--- end of example ---

All files MUST be returned completely with all the functions and definitions because they will be saved into files directly or with omitted code following \`omit rule\`, so even large files must be completed with no brevity or omitted functions.

## VALIDATION
To validate this input provide response in current chat format with the request.`
	}
}

export default SystemRulesCritical
