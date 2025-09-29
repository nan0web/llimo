import { promises as fs } from 'fs'
import { glob } from 'glob'
import path from 'path'

export default class Dataset {
	lang
	pkgName
	rootDir
	constructor({ lang = 'en', pkgName }) {
		this.lang = lang
		this.pkgName = pkgName
		this.entries = []
	}

	push(entry) {
		const {
			instruction,
			input = '',
			context = [],
			proven = `assert-in-${this.pkgName}`,
			tags = [],
			lang = this.lang
		} = entry
		this.entries.push({
			instruction,
			input,
			context: [...new Set([this.pkgName, ...context])],
			proven,
			tags,
			lang,
		})
	}

	async saveMeta() {
		const dir = path.join(this.rootDir, 'datasets')
		const file = path.join(dir, `${this.pkgName}.dataset.jsonl`)

		await fs.mkdir(dir, { recursive: true })
		await fs.writeFile(
			file,
			this.entries.map(e => JSON.stringify(e)).join('\n')
		)

		console.log(`✅ Dataset *metadata* saved: ${file} (${this.entries.length} entries)`)
	}

	static async assembleFrom(rootDir = process.cwd()) {
		const metadataFiles = await glob(path.join(rootDir, 'datasets/*.dataset.jsonl'))

		const fullDataset = []

		for (const metadataFile of metadataFiles) {
			const pkgName = path.basename(metadataFile, '.dataset.jsonl').replace('.dataset', '')

			const metadataContent = await fs.readFile(metadataFile, 'utf8')
			const metadataEntries = metadataContent
				.trim()
				.split('\n')
				.map(line => JSON.parse(line))

			for (const entry of metadataEntries) {
				const testFile = path.join(rootDir, 'packages', pkgName, 'src', 'README.md.js')
				const readmeFile = path.join(rootDir, 'packages', pkgName, 'README.md')

				let testCode = '', readmeContent = ''

				try {
					testCode = await fs.readFile(testFile, 'utf8')
				} catch (e) {
					console.warn(`🟡 Test file not found: ${testFile}`)
				}

				try {
					readmeContent = await fs.readFile(readmeFile, 'utf8')
				} catch (e) {
					console.warn(`🟡 README not found: ${readmeFile}`)
				}

				// 🔍 Витягуємо код тесту за `instruction`
				const code = Dataset.extractCodeByInstruction(testCode, entry.instruction)

				// 🔍 Коментар виводу: `// ← ...`
				const commentMatch = code?.match(/\/\/\s*←\s*(.+?)(?=\n|$)/)
				const outputComment = commentMatch ? commentMatch[1] : undefined

				// 🔍 З `@docs` блоку — опис (markdown-фрагмент)
				const docsFragment = Dataset.extractDocsFragment(testCode, entry.context)

				// 🔍 Фрагмент з README.md (пов’язаний опис)
				const readmeFragment = Dataset.extractReadmeFragment(readmeContent, entry.instruction)

				fullDataset.push({
					...entry,
					code,                    // JS block from test
					outputComment,          // "Вітаю, Богдан!"
					docs: docsFragment,     // @docs comment as markdown
					readme: readmeFragment  // relevant part from README.md
				})
			}
		}

		const outFile = path.join(rootDir, 'datasets.full.jsonl')
		await fs.writeFile(
			outFile,
			fullDataset.map(e => JSON.stringify(e)).join('\n')
		)

		console.log(`✅ Full dataset assembled: ${outFile} (${fullDataset.length} entries)`)
		return fullDataset
	}

	static extractCodeByInstruction(source, instruction) {
		const escaped = Dataset.escapeRegex(instruction)
		const regex = new RegExp(`it\\([^)]*?\\)\\s*{[^}]*?dataset\\.push\\([^}]*?instruction:\\s*?"${escaped}"[^}]*?\\)[^}]*?}`, 's')
		const match = source.match(regex)
		if (!match) return null

		const body = match[0]
		const codeBlock = body.match(/{((?:[^{}]|{[^{}]*})*)}/)?.[1]?.trim()
		return codeBlock ? `{\n  ${codeBlock}\n}` : body
	}

	static extractDocsFragment(source, context) {
		const docsBlocks = source.matchAll(/\/\\*\\*[^*]*\\*+([^/*][^\\*]*\\*+)\\*\\/ / g)
		for (const block of docsBlocks) {
			const content = block[1]
			if (content.includes('@docs') && context.some(ctx => content.includes(ctx))) {
				return content.replace('@docs', '').trim()
			}
		}
		return null
	}

	static extractReadmeFragment(readme, instruction) {
		// Якщо інструкція — типова квістія — шукаємо у заголовках
		const keywords = instruction.toLowerCase().split('?')[0].split(' ').slice(-3)
		const pattern = new RegExp(`(?:#+.*${keywords.map(Dataset.escapeRegex).join('.*')}.*\\n(?:.*\\n)*?)(?=#+|$)`, 'g')
		const match = readme.match(pattern)
		return match ? match[0].trim() : null
	}

	static escapeRegex(str) {
		return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
	}
}
