export default OpenRouterProvider;
declare class OpenRouterProvider extends ChatProvider {
    /**
     * @param {object} props
     * @param {ChatDriver} props.driver
     * @param {string} [props.name=""]
     * @param {string} [props.slug=""]
     * @param {boolean} [props.may_log_prompts=false]
     * @param {boolean} [props.may_train_on_data=false]
     * @param {boolean} [props.moderated_by_openrouter=false]
     * @param {string} [props.privacy_policy_url=""]
     * @param {string} [props.terms_of_service_url=""]
     * @param {string} [props.status_page_url=""]
     */
    constructor(props: {
        driver: ChatDriver;
        name?: string | undefined;
        slug?: string | undefined;
        may_log_prompts?: boolean | undefined;
        may_train_on_data?: boolean | undefined;
        moderated_by_openrouter?: boolean | undefined;
        privacy_policy_url?: string | undefined;
        terms_of_service_url?: string | undefined;
        status_page_url?: string | undefined;
    });
}
import ChatProvider from "../Provider.js";
import ChatDriver from "../Driver/ChatDriver.js";
