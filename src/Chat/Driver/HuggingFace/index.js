import HuggingFaceDriver from "./HuggingFaceDriver.js"
import HuggingFaceModels from "./Models/index.js"
import HuggingFaceProviders from "./Providers/index.js"
import HFDriverOptions from "./Options.js"

HuggingFaceDriver.MODELS = HuggingFaceModels
HuggingFaceDriver.PROVIDERS = HuggingFaceProviders
HuggingFaceDriver.Options = HFDriverOptions

export default HuggingFaceDriver
