import { Client } from "@gradio/client"

const client = await Client.connect("glodov/chat")
const result = await client.predict("/chat", {
	message: "Hello!!",
	system_message: "Hello!!",
	max_tokens: 1,
	temperature: 0.1,
	top_p: 0.1,
});
// import HuggingFaceDriver from "./HuggingFace/HuggingFaceDriver.js"

// class OwnDriver extends HuggingFaceDriver {

// }

// export default OwnDriver
