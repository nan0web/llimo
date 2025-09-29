import { describe, it } from "node:test"
import assert from "node:assert"
import URIPattern from "./URIPattern.js"
import micromatch from "micromatch"

describe("URIPattern", () => {
	it("should detect remote URIs correctly", () => {
		const remoteURIs = [
			"http://example.com",
			"https://example.com",
			"ftp://example.com",
			"//example.com",
		]
		for (const uri of remoteURIs) {
			const pattern = new URIPattern(uri)
			assert.strictEqual(pattern.isRemote, true, `Expected "${uri}" to be remote`)
			assert.strictEqual(pattern.isLocal, false, `Expected "${uri}" not to be local`)
		}
	})

	it("should detect local URIs correctly", () => {
		const localURIs = [
			"./local/file.js",
			"local/file.js",
			"/absolute/path",
			"no/scheme",
		]
		for (const uri of localURIs) {
			const pattern = new URIPattern(uri)
			assert.strictEqual(pattern.isLocal, true, `Expected "${uri}" to be local`)
			assert.strictEqual(pattern.isRemote, false, `Expected "${uri}" not to be remote`)
		}
	})

	it("should detect patterns correctly", () => {
		const uris = [
			["*.js", 1],
			["./src/**/*.jsx", 1],
			["src/{a,b,c}.js", 1],
			["file?.txt", 1],
			["file.js", 0],
			["./src/index.jsx", 0],
			["/absolute/path/file.txt", 0],
		]
		for (const [uri, ok] of uris) {
			const pattern = new URIPattern(uri)
			assert.strictEqual(pattern.isPattern, Boolean(ok), `Expected "${uri}" ${ok ? "" : "NOT "}to be a pattern`)
		}
	})

	it("should return correct static prefix", () => {
		const testCases = [
			["./src/models/*.js", "./src/models/"],
			["/absolute/path/file?.txt", "/absolute/path/file"],
			["*.js", ""],
			["no-pattern.txt", "no-pattern.txt"],
			["/absolute/no-pattern.txt", "/absolute/no-pattern.txt"],
		]

		for (const [input, expected] of testCases) {
			const pattern = new URIPattern(input)
			const prefix = pattern.staticPrefix
			assert.strictEqual(prefix, expected, `Expected prefix of "${input}" = "${expected}" != "${prefix}"`)
		}
	})

	it("should filter array correctly including suffix", () => {
		const testCases = [
			["./s/**/*.js", ["./s/a.js", "./s/n/b.js", "./o/f.js"], ["s/a.js", "s/n/b.js"]],
			["s/", ["s/f.js", "s/n/a.jsx", "other/f.js"], ["s/f.js", "s/n/a.jsx"]],
			["./p/*", ["./p/i.html", "./p/a/logo.png", "./src/app.js"], ["p/i.html"]],
			["./p/**", ["./p/i.html", "./p/a/logo.png", "./src/app.js"], ["p/i.html", "p/a/logo.png"]],
			["/a/b/*.txt", ["/a/b/c1.txt", "/a/b/c2.txt", "/other/c.txt"], ["/a/b/c1.txt", "/a/b/c2.txt"]],
			["src/", [], []],
		]

		for (const [input, array, expected] of testCases) {
			const pattern = new URIPattern(input)
			const result = pattern.filter(array)
			assert.deepStrictEqual(result, expected, `Filtering with pattern "${input}" failed`)
		}
	})
})
