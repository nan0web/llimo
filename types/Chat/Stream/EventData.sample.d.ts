declare namespace _default {
    let many: ({
        id: string;
        model: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
            manual: boolean;
            cost: number;
            currency: string;
            prices: {
                currency: string;
                batchDiscount: number;
                speed: number;
                input: number;
                output: number;
                cache: number;
            };
            features: {
                "0": string;
                "1": string;
                "2": string;
                "3": string;
                chatCompletions: boolean;
                assistants: boolean;
            };
            input: string[];
            output: string[];
            context: {
                window: number;
                output: number;
                date: string;
                name: string;
                input: number;
            };
            name: string;
            provider: string;
        };
        prompt: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            role: string;
            content: string;
            username: string;
        };
        startedAt: number;
        chunk: {
            id: string;
            object: string;
            created: number;
            model: string;
            service_tier: string;
            system_fingerprint: string;
            choices: {
                index: number;
                delta: {
                    content: string;
                };
                logprobs: null;
                finish_reason: null;
            }[];
        };
        delta: string;
        options: {
            model: string;
            messages: {
                role: string;
                content: string;
            }[];
            stream: boolean;
        };
        content?: undefined;
    } | {
        id: string;
        model: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
            manual: boolean;
            cost: number;
            currency: string;
            prices: {
                currency: string;
                batchDiscount: number;
                speed: number;
                input: number;
                output: number;
                cache: number;
            };
            features: {
                "0": string;
                "1": string;
                "2": string;
                "3": string;
                chatCompletions: boolean;
                assistants: boolean;
            };
            input: string[];
            output: string[];
            context: {
                window: number;
                output: number;
                date: string;
                name: string;
                input: number;
            };
            name: string;
            provider: string;
        };
        prompt: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            role: string;
            content: string;
            username: string;
        };
        startedAt: number;
        options: {
            model: string;
            messages: {
                role: string;
                content: string;
            }[];
            stream: boolean;
        };
        content: string;
        chunk?: undefined;
        delta?: undefined;
    })[];
    namespace single {
        let id: string;
        let model: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            "4": string;
            "5": string;
            "6": string;
            manual: boolean;
            cost: number;
            currency: string;
            prices: {
                currency: string;
                batchDiscount: number;
                speed: number;
                input: number;
                output: number;
                cache: number;
            };
            features: {
                "0": string;
                "1": string;
                "2": string;
                "3": string;
                chatCompletions: boolean;
                assistants: boolean;
            };
            input: string[];
            output: string[];
            context: {
                window: number;
                output: number;
                date: string;
                name: string;
                input: number;
            };
            name: string;
            provider: string;
        };
        let prompt: {
            "0": string;
            "1": string;
            "2": string;
            "3": string;
            role: string;
            content: string;
            username: string;
        };
        let startedAt: number;
        namespace options {
            let model_1: string;
            export { model_1 as model };
            export let messages: {
                role: string;
                content: string;
            }[];
            export let stream: boolean;
        }
        let content: string;
    }
}
export default _default;
