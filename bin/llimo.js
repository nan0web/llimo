#!/usr/bin/env node

import process from "node:process"
import { Command, CommandMessage } from "@nan0web/co"
import { Logger } from "@nan0web/log"
import FS from "@nan0web/db-fs"

const console = new Logger(Logger.detectLevel(process.argv))

class TemplatesCommand extends Command {
	constructor() {
		super({
			name: "templates",
			help: "Use templates for LLM",
		})
		this.addArgument("*", String, "", "Template name or its unique part", false)
		this.fs = new FS()
	}
	/**
	 * @param {CommandMessage} msg
	 */
	async run(msg) {
		await this.fs.connect()
		const pkg = await this.fs.loadDocument("package.json", {})
		if (!pkg.name) {
			throw new Error("Current directory has no Java•Script project {package.json}")
		}
		let parent = this.fs
		let parentPkg = pkg
		if ("@nan0web/monorepo" !== pkg.name) {
			const segments = this.fs.absolute().split("/").slice(0, -2)
			const parentURI = segments.join("/")
			parent = new FS({ cwd: parentURI })
			await parent.connect()
			parentPkg = await parent.loadDocument("package.json", {})
		}
		if ("@nan0web/monorepo" !== parentPkg.name) {
			throw new Error("Monorepo not found in " + parentURI)
		}
		const llm = parent.extract("llm/templates/")
		for await (const entry of llm.findStream("")) { }
		const templates = Array.from(llm.meta.keys())
		if (msg.args[0]) {
			const found = templates.filter(t => t.includes(msg.args[0]))
			if (found.length > 1) {
				console.warn("Found more than one template:")
				found.forEach(row => console.info(" - " + row))
				return
			}
			else if (found.length) {
				const document = await llm.loadDocument(found[0])
				console.info(
					document
						.replaceAll("$pkgDir", pkg.name.replace("@nan0web/", ""))
						.replaceAll("$pkgName", pkg.name)
				)
				return
			}
			console.error("No templates found")
		}
		console.success("Available templates:")
		templates.forEach(row => console.info(" - " + row))
	}
}

class MainCommand extends Command {
	constructor() {
		super({
			name: "llimo",
			help: "Language Living Model (LLiMo) CLI application",
		})
		this.addSubcommand(new TemplatesCommand())
	}
	async run(argv = []) {
		if (process.stdout.isTTY) {
			console.log(Logger.style(Logger.LOGO, { color: "magenta" }))
		}
		const msg = this.parse(argv)
		if (msg.subCommand) {
			const cmd = this.getCommand(msg.subCommand)
			await cmd.run(msg.subCommandMessage)
		}
	}
}

const cmd = new MainCommand()

cmd.run(process.argv.slice(2)).catch(err => {
	console.error(err.message ?? err)
	if (err.stack) console.debug(err.stack)
	process.exit(1)
})
