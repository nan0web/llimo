import SystemRulesCommunication from "./rules/00-Communication.js"
import SystemRulesCommands from "./rules/01-Commands.js"
import SystemRulesFiles from "./rules/02-Files.js"
import SystemRulesFormattingFiles from "./rules/03-Formatting-files.js"
import SystemRulesNanoFormat from "./rules/04-Nano-format.js"
import SystemRulesVitest from "./rules/05-Vitest.js"
import SystemRulesWebReact from "./rules/06-Web-React.js"
import SystemRulesCritical from "./rules/07-Critical.js"

const systemMd = [
	"# @nan0web/agent-software-engineer v1",
	"## CHATTING RULES",
	new SystemRulesCommunication(),
	new SystemRulesCommands(),
	new SystemRulesFiles(),
	new SystemRulesFormattingFiles(),
	new SystemRulesNanoFormat(),
	new SystemRulesVitest(),
	new SystemRulesWebReact(),
	new SystemRulesCritical(),
].join("\n\n")

export default systemMd
