declare namespace _default {
    let name: string;
    let url: string;
    let models: ({
        $default: {
            options: {
                temperature: number;
                top_p: number;
            };
        };
        name?: undefined;
        cost?: undefined;
        maxTokens?: undefined;
        options?: undefined;
        maxTokensOfficial?: undefined;
        costIn?: undefined;
        costOut?: undefined;
    } | {
        name: string;
        cost: number;
        maxTokens: number;
        options: {
            temperature: number;
            top_p: number;
        };
        $default?: undefined;
        maxTokensOfficial?: undefined;
        costIn?: undefined;
        costOut?: undefined;
    } | {
        name: string;
        cost: number;
        maxTokens: number;
        maxTokensOfficial: number;
        $default?: undefined;
        options?: undefined;
        costIn?: undefined;
        costOut?: undefined;
    } | {
        name: string;
        costIn: number;
        costOut: number;
        maxTokens: number;
        $default?: undefined;
        cost?: undefined;
        options?: undefined;
        maxTokensOfficial?: undefined;
    })[];
}
export default _default;
