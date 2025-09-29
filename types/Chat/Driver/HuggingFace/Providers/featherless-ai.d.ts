declare namespace _default {
    let name: string;
    let url: string;
    let costIn: number;
    let costOut: number;
    let models: ({
        name: string;
        cost: number;
        maxTokens: number;
        costIn?: undefined;
        costOut?: undefined;
    } | {
        name: string;
        costIn: number;
        costOut: number;
        maxTokens: number;
        cost?: undefined;
    })[];
}
export default _default;
