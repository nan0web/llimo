import { describe, it } from 'node:test'
import assert from 'node:assert/strict'
import MDRelease from './MDRelease.js'
import { MDHeading1 } from '@nan0web/markdown'

describe('MDRelease', () => {
	it('should parse valid release string correctly', () => {
		const release = MDRelease.parse('MVP release - v0.1.0')
		assert.strictEqual(release.name, 'MVP release')
		assert.strictEqual(release.major, '0')
		assert.strictEqual(release.minor, '1')
		assert.strictEqual(release.patch, '0')
		assert.strictEqual(release.version, 'v0.1.0')
	})

	it('should throw TypeError for invalid version format', () => {
		assert.throws(() => {
			MDRelease.parse('Invalid release - invalid.version.format')
		}, TypeError)
	})

	it('should construct from object input', () => {
		const release = new MDRelease({
			name: 'Test Release',
			major: '1',
			minor: '2',
			patch: '3'
		})
		assert.strictEqual(release.name, 'Test Release')
		assert.strictEqual(release.major, '1')
		assert.strictEqual(release.minor, '2')
		assert.strictEqual(release.patch, '3')
		assert.strictEqual(release.version, 'v1.2.3')
	})

	it('should construct from MDHeading1 instance', () => {
		const heading = new MDHeading1({ content: 'Feature Release - v2.5.1' })
		const release = MDRelease.from(heading)
		assert.ok(release instanceof MDRelease)
		assert.strictEqual(release.name, 'Feature Release')
		assert.strictEqual(release.major, '2')
		assert.strictEqual(release.minor, '5')
		assert.strictEqual(release.patch, '1')
		assert.strictEqual(release.version, 'v2.5.1')
	})

	it('should return the same instance if input is already MDRelease', () => {
		const originalRelease = new MDRelease({ name: 'Original', major: '1', minor: '0', patch: '0' })
		const release = MDRelease.from(originalRelease)
		assert.strictEqual(release, originalRelease)
	})

	it('should correctly serialize to string', () => {
		const release = new MDRelease({
			name: 'Test Release',
			major: '1',
			minor: '0',
			patch: '0'
		})
		assert.strictEqual(String(release), 'Test Release - v1.0.0')
	})
})
