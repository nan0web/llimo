declare namespace _default {
    let mappings: ({
        _id: string;
        provider: string;
        status: string;
        model: {
            id: string;
            authorData: {
                avatarUrl: string;
                fullname: string;
                name: string;
                type: string;
                isHf: boolean;
                isHfAdmin: boolean;
                isMod: boolean;
                isEnterprise: boolean;
                followerCount: number;
                _id?: undefined;
                isPro?: undefined;
            };
        };
        features: {
            structuredOutput: boolean;
            toolCalling: boolean;
        };
        performance: {
            requestLatencyMs: number;
            firstTokenLatencyMs: number;
            numGeneratedTokens: number;
        };
        lastValidationTimestamp: string;
    } | {
        _id: string;
        provider: string;
        status: string;
        model: {
            id: string;
            authorData: {
                avatarUrl: string;
                fullname: string;
                name: string;
                type: string;
                isHf: boolean;
                isHfAdmin: boolean;
                isMod: boolean;
                isEnterprise: boolean;
                followerCount: number;
                _id?: undefined;
                isPro?: undefined;
            };
        };
        features: {
            structuredOutput: boolean;
            toolCalling: boolean;
        };
        performance: {
            firstTokenLatencyMs: number;
            requestLatencyMs: number;
            numGeneratedTokens?: undefined;
        };
        lastValidationTimestamp: string;
    } | {
        _id: string;
        provider: string;
        status: string;
        model: {
            id: string;
            authorData: {
                avatarUrl: string;
                fullname: string;
                name: string;
                type: string;
                isHf: boolean;
                isHfAdmin: boolean;
                isMod: boolean;
                isEnterprise: boolean;
                followerCount: number;
                _id?: undefined;
                isPro?: undefined;
            };
        };
        performance: {
            requestLatencyMs: number;
            firstTokenLatencyMs?: undefined;
            numGeneratedTokens?: undefined;
        };
        lastValidationTimestamp: string;
        features?: undefined;
    } | {
        _id: string;
        provider: string;
        status: string;
        model: {
            id: string;
            authorData: {
                avatarUrl: string;
                fullname: string;
                name: string;
                type: string;
                isHf: boolean;
                isHfAdmin: boolean;
                isMod: boolean;
                isEnterprise: boolean;
                followerCount: number;
                _id?: undefined;
                isPro?: undefined;
            };
        };
        performance: {
            firstTokenLatencyMs: number;
            requestLatencyMs: number;
            numGeneratedTokens?: undefined;
        };
        lastValidationTimestamp: string;
        features?: undefined;
    } | {
        _id: string;
        provider: string;
        status: string;
        model: {
            id: string;
            authorData: {
                _id: string;
                avatarUrl: string;
                fullname: string;
                name: string;
                type: string;
                isPro: boolean;
                isHf: boolean;
                isHfAdmin: boolean;
                isMod: boolean;
                followerCount: number;
                isEnterprise?: undefined;
            };
        };
        features: {
            structuredOutput: boolean;
            toolCalling: boolean;
        };
        performance: {
            firstTokenLatencyMs: number;
            requestLatencyMs: number;
            numGeneratedTokens?: undefined;
        };
        lastValidationTimestamp: string;
    } | {
        _id: string;
        provider: string;
        status: string;
        model: {
            id: string;
            authorData: {
                _id: string;
                avatarUrl: string;
                fullname: string;
                name: string;
                type: string;
                isPro: boolean;
                isHf: boolean;
                isHfAdmin: boolean;
                isMod: boolean;
                followerCount: number;
                isEnterprise?: undefined;
            };
        };
        features: {
            structuredOutput: boolean;
            toolCalling: boolean;
        };
        performance: {
            firstTokenLatencyMs: number;
            numGeneratedTokens: number;
            requestLatencyMs: number;
        };
        lastValidationTimestamp: string;
    })[];
    let orderedInferenceProviders: string[];
}
export default _default;
