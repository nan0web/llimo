import Model from "../../Model.js"

const data = ["o1-pro", {
	prices: { i: 150.00, o: 600, speed: 1 },
	input: ["text", "image"], output: ["text"],
	context: { window: 200_000, output: 100_000, date: "2023-10-01" },
}]
const model = Model.from({ ...data[1], name: data[0] })
console.info(model)
