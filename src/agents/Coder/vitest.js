import { loadConfigFromFile } from 'vite'
import { mergeConfig } from 'vite'
import { configDefaults } from 'vitest/config'
import { createVitest } from 'vitest/node'
import fg from 'fast-glob'
import { statSync } from "node:fs"
import path from 'node:path'
import process from 'node:process'
import { findAllFiles } from 'nanoweb-fs'

const root = process.cwd()

const configPath = path.resolve(root, 'vitest.config.js')
const userConfig = (await loadConfigFromFile({ command: "serve", mode: "dev" }, configPath))?.config ?? {}
const finalConfig = mergeConfig({ test: configDefaults }, userConfig)

let args = process.argv.slice(2)

if (args.length === 0) {
	const include = finalConfig.test?.include ?? ['**/*.{test,spec}.{js,ts,jsx,tsx}']
	const exclude = finalConfig.test?.exclude ?? ['node_modules', 'dist']

	args = await fg(include, {
		ignore: exclude,
		cwd: root,
		absolute: true,
	})

	// args = args.map((a) => path.resolve(root, a))

	if (args.length === 0) {
		console.error('❗ No test files found')
		process.exit(1)
	}
}

console.info('📦 Running tests for files:\n')
let count = 0
args.forEach((file) => {
	const filePath = path.resolve(root, file)
	const stat = statSync(filePath)
	if (stat.isDirectory()) {
		const files = findAllFiles(filePath, /\.test\.(js|jsx)$/i)
		files.forEach(file => {
			++count
			console.info(' -', path.relative(root, file))
		})
	} else {
		++count
		console.info(' -', path.relative(root, file))
	}
})
console.info(`   --- Total Files: ${count} ---   `)

const vitest = await createVitest('test', {
	...finalConfig,
	run: true,
	silent: false,
	watch: false,
})

await vitest.start(args)
