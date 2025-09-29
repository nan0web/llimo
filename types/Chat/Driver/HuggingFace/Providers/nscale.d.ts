declare namespace _default {
    let name: string;
    let url: string;
    let models: ({
        $default: {
            provider: string;
            options: {
                temperature: number;
                top_p: number;
            };
        };
        name?: undefined;
        costIn?: undefined;
        costOut?: undefined;
        maxTokens?: undefined;
        cost?: undefined;
    } | {
        name: string;
        costIn: number;
        costOut: number;
        maxTokens: number;
        $default?: undefined;
        cost?: undefined;
    } | {
        name: string;
        costIn: number;
        cost: number;
        maxTokens: number;
        $default?: undefined;
        costOut?: undefined;
    })[];
}
export default _default;
