export default class Dataset {
    static assembleFrom(rootDir?: string): Promise<any[]>;
    static extractCodeByInstruction(source: any, instruction: any): any;
    static extractDocsFragment(source: any, context: any): any;
    static extractReadmeFragment(readme: any, instruction: any): any;
    static escapeRegex(str: any): any;
    constructor({ lang, pkgName }: {
        lang?: string | undefined;
        pkgName: any;
    });
    lang: string;
    pkgName: any;
    rootDir: any;
    entries: any[];
    push(entry: any): void;
    saveMeta(): Promise<void>;
}
