declare namespace _default {
    let name: string;
    let url: string;
    let models: ({
        $default: {
            provider: string;
            cost: number;
            options: {
                temperature: number;
                top_p: number;
            };
        };
        name?: undefined;
        maxTokens?: undefined;
        maxTokensOfficial?: undefined;
    } | {
        name: string;
        maxTokens: number;
        maxTokensOfficial: number;
        $default?: undefined;
    } | {
        name: string;
        maxTokens: number;
        $default?: undefined;
        maxTokensOfficial?: undefined;
    })[];
}
export default _default;
