import fetch from "nanoweb-http"
import { NonEmptyObject, to } from "@nan0web/types"
import HuggingFaceProvider from "../HuggingFaceProvider.js"
import HuggingFaceModel from "../HuggingFaceModel.js"
import HuggingFaceAuthor from "../HuggingFaceAuthor.js"
import process from "node:process"
import { fileURLToPath } from 'node:url'
import { relative, resolve } from 'node:path'
import { save } from "nanoweb-fs"
const __dirname = resolve(fileURLToPath(import.meta.url), "../../Providers/")

async function fetchProviders(url) {
	const response = await fetch(url)
	if (!response.ok) {
		throw new Error("Cannot retrieve models from" + " " + url)
	}
	console.info("Parsing data")
	const html = await response.text()
	const rows = html.split("\n")
	const stop = 'data-target="InferenceProvidersTable" data-props="'
	const index = rows.findIndex(row => row.includes(stop))
	const row = rows[index].split(stop)[1].split('"><div')[0]
	/** @type {Map<string, HuggingFaceProvider>} */
	const providers = new Map()
	const authors = new Map()
	const json = JSON.parse(decodeURI(row).replaceAll("&quot;", '"'))
	json.mappings.map(el => {
		if (!providers.has(el.provider)) {
			providers.set(el.provider, new HuggingFaceProvider(el.provider))
		}
		if (!authors.has(el.model.authorData.name)) {
			authors.set(el.model.authorData.name, new HuggingFaceAuthor(el.model.authorData))
		}
		const provider = providers.get(el.provider)
		const model = new HuggingFaceModel({
			...el,
			name: el.model.id,
			author: el.model.authorData.name,
			validatedAt: el.lastValidationTimestamp,
		})
		provider.models.push(model)
	})
	return { providers, authors }
}

async function main() {
	const url = "https://huggingface.co/inference-providers/models"
	console.info("Fetching", url)
	const { authors, providers } = await fetchProviders(url)

	const cwd = process.cwd()
	const file = resolve(__dirname, "authors.json")
	const rel = relative(cwd, file)
	console.info("Saving authors")
	save(file, to(Object)(authors), null, "\t")
	console.info(" -", rel)

	console.info("Saving", providers.size, "providers")
	for (const [name, provider] of providers) {
		provider.models.sort((a, b) => a.name.localeCompare(b.name))
		const file = resolve(__dirname, name + ".json")
		const non = to(NonEmptyObject)(provider)
		save(file, to(Object)(non), null, "\t")
		const rel = relative(cwd, file)
		console.info(" -", rel)
	}
}

main().catch(console.error)

