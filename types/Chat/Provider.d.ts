export default ChatProvider;
declare class ChatProvider {
    /**
     * @param {any} props
     * @returns {ChatProvider}
     */
    static from(props?: any): ChatProvider;
    /**
     * @param {object} props
     * @param {string} [props.name]
     * @param {string} [props.slug]
     * @param {string} [props.privacy_policy_url]
     * @param {string} [props.terms_of_service_url]
     * @param {string} [props.status_page_url]
     * @param {boolean} [props.may_log_prompts]
     * @param {boolean} [props.may_train_on_data]
     * @param {boolean} [props.moderated_by_openrouter]
     * @param {ChatDriver} props.driver
     * @param {object} [props.auth]
     * @param {DB} [props.db]
     * @param {object} [props.options]
     */
    constructor(props: {
        name?: string | undefined;
        slug?: string | undefined;
        privacy_policy_url?: string | undefined;
        terms_of_service_url?: string | undefined;
        status_page_url?: string | undefined;
        may_log_prompts?: boolean | undefined;
        may_train_on_data?: boolean | undefined;
        moderated_by_openrouter?: boolean | undefined;
        driver: ChatDriver;
        auth?: object;
        db?: DB | undefined;
        options?: object;
    });
    /** @type {string} */
    name: string;
    /** @type {string} */
    slug: string;
    /** @type {string} */
    privacy_policy_url: string;
    /** @type {string} */
    terms_of_service_url: string;
    /** @type {string} */
    status_page_url: string;
    /** @type {boolean} */
    may_log_prompts: boolean;
    /** @type {boolean} */
    may_train_on_data: boolean;
    /** @type {boolean} */
    moderated_by_openrouter: boolean;
    /** @type {ChatDriver} */
    driver: ChatDriver;
    /** @type {object} */
    auth: object;
    /** @type {object} */
    options: object;
    db: DB | undefined;
    get empty(): boolean;
    toString(): string;
    init(): Promise<void>;
}
import ChatDriver from "./Driver/ChatDriver.js";
import DB from "@nan0web/db";
