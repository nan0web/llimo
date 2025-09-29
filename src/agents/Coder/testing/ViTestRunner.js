import { loadConfigFromFile } from 'vite'
import { mergeConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { createVitest } from 'vitest/node'
import fg from 'fast-glob'
import { statSync } from "node:fs"
import path from 'node:path'
import { Writable } from 'node:stream'
import { findAllFiles } from 'nanoweb-fs'
import TestRunner from "./TestRunner.js"
import TestRunnerExpect from './TestRunnerExpect.js'
class CustomReporter {
	constructor(options) {
		this.runner = options.runner // <-- optional, to pass your runner/context
	}

	onConsoleLog(log, { task, type }) {
		// from `console.log()` in test files
		const lines = log.split('\n')
		lines.forEach((line, index) => {
			this.runner.processLine?.({ line, index })
			this.runner.emit?.("data", { line })
		})
	}

	onStdOut(text) {
		const lines = text.toString().split('\n')
		lines.forEach((line, index) => {
			this.runner.processLine?.({ line, index })
			this.runner.emit?.("data", { line })
		})
	}

	onStdErr(text) {
		const lines = text.toString().split('\n')
		lines.forEach((line, index) => {
			this.runner.processLine?.({ line, index })
			this.runner.emit?.("data", { line })
		})
	}
}

/**
 * Usage:
 * import ViTestRunner from "./apps/cli/src/tests/ViTestRunner.js"
 * const runner = new ViTestRunner(process.cwd())
 * runner.run(process.argv.slice(2))
 */
class ViTestRunner extends TestRunner {
	constructor(cwd) {
		super(cwd)
	}
	async run(args, command) {

		const configPath = path.resolve(this.cwd, 'vitest.config.js')
		const userConfig = (await loadConfigFromFile({ command: "serve", mode: "dev" }, configPath))?.config ?? {}
		const finalConfig = mergeConfig({ test: configDefaults }, userConfig)

		if (args.length === 0) {
			const include = finalConfig.test?.include ?? ['**/*.{test,spec}.{js,ts,jsx,tsx}']
			const exclude = finalConfig.test?.exclude ?? ['node_modules', 'dist']

			args = await fg(include, {
				ignore: exclude,
				cwd: this.cwd,
				absolute: true,
			})

			if (args.length === 0) {
				console.error('❗ No test files found')
				return false
			}
		}

		// console.info('📦 Running tests for files:\n')
		// let count = 0
		const files = []
		args.forEach((file) => {
			const filePath = path.resolve(this.cwd, file)
			const stat = statSync(filePath)
			if (stat.isDirectory()) {
				const all = findAllFiles(filePath, /\.test\.(js|jsx)$/i)
				all.forEach(file => {
					// ++count
					files.push(file)
					// console.info(' -', path.relative(root, file))
				})
			} else {
				// ++count
				files.push(file)
				// console.info(' -', path.relative(root, file))
			}
		})
		// console.info(`   --- Total Files: ${count} ---   `)

		const total = new TestRunnerExpect({
			files,
			total: files.length,
		})

		const handleOutput = (log) => {
			const lines = log.toString().split('\n')
			lines.forEach((line, index) => {
				this.processLine({ line, index, total, lines })
				this.emit("data", { ...total, line })
			})
		}

		const vitest = await createVitest('test', {
			...finalConfig,
			run: true,
			silent: true,
			watch: false,
			reporters: [
				{
					reporter: new CustomReporter({ runner: this }),
					name: 'custom'
				}
			]
		})

		await vitest.start(args)
		// const { stdout, stderr } = await super.run(args, command)
		// return { stdout, stderr }
	}
}

export default ViTestRunner
