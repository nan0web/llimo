class HuggingFaceAuthor {
	/** @type {string} */
	avatarUrl
	/** @type {string} */
	fullname
	/** @type {string} */
	name
	/** @type {string} */
	type
	/** @type {boolean} */
	isHf
	/** @type {boolean} */
	isHfAdmin
	/** @type {boolean} */
	isMod
	/** @type {boolean} */
	isEnterprise
	/** @type {number} */
	followerCount
	constructor(props = {}) {
		const {
			avatarUrl,
			fullname,
			name,
			type,
			isHf,
			isHfAdmin,
			isMod,
			isEnterprise,
			followerCount
		} = props
		this.avatarUrl = avatarUrl
		this.fullname = fullname
		this.name = name
		this.type = type
		this.isHf = isHf
		this.isHfAdmin = isHfAdmin
		this.isMod = isMod
		this.isEnterprise = isEnterprise
		this.followerCount = followerCount
	}
}

export default HuggingFaceAuthor
