import Model from "../../../../Model.js"

const data = {
	name: "ArliAI/DS-R1-Qwen3-8B-ArliAI-RpR-v4-Small"
}
let model

if (!model) {
	model = Model.from(data)
}

export default model
