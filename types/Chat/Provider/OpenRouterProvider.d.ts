export default OpenRouterProvider;
declare class OpenRouterProvider extends ChatProvider {
    /**
     * @param {object} props
     * @param {string} props.name
     * @param {string} props.slug
     * @param {boolean} props.may_log_prompts
     * @param {boolean} props.may_train_on_data
     * @param {boolean} props.moderated_by_openrouter
     * @param {string} props.privacy_policy_url
     * @param {string} props.terms_of_service_url
     * @param {string} props.status_page_url
     */
    constructor(props?: {
        name: string;
        slug: string;
        may_log_prompts: boolean;
        may_train_on_data: boolean;
        moderated_by_openrouter: boolean;
        privacy_policy_url: string;
        terms_of_service_url: string;
        status_page_url: string;
    });
}
import ChatProvider from "../Provider.js";
