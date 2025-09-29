class VitestLogDuration {
	/** @type {number} */
	total
	/** @type {number} */
	transform
	/** @type {number} */
	setup
	/** @type {number} */
	collect
	/** @type {number} */
	tests
	/** @type {number} */
	environment
	/** @type {number} */
	prepare
	constructor(props = {}) {
		const {
			total,
			transform,
			setup,
			collect,
			tests,
			environment,
			prepare,
		} = props
		this.total = Number(total)
		this.transform = Number(transform)
		this.setup = Number(setup)
		this.collect = Number(collect)
		this.tests = Number(tests)
		this.environment = Number(environment)
		this.prepare = Number(prepare)
	}
	static parse(line) {
		if (!line.trim().startsWith("Duration")) return null
		const [_, str] = line.trim().split("Duration")
		const [total_, all] = str.trim().split('(')
		const multiplier = total_.trim().endsWith('ms') ? 1 : 1000
		const total = Number(total_.trim().replace(/[ms]+$/, '')) * multiplier
		const instance = new this({ total })
		all.replace(")", "").split(", ").forEach(s => {
			const [key, value] = s.trim().split(' ')
			const multiplier = value.trim().endsWith('ms') ? 1 : 1000
			instance[key] = Number(value.replace(/[ms]+$/, '')) * multiplier
		})
		return instance
	}
}

export default VitestLogDuration
