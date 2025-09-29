export default CoderView;
declare class CoderView extends View {
}
declare class View {
    constructor(app: any, stdout: any);
    /** @type {App} */
    app: App;
    /** @type {Window} */
    window: Window;
    /** @type {number} */
    startedAt: number;
    /** @type {string|string[]} */
    prev: string | string[];
    startTimer(): void;
    get spent(): number;
    format(): void;
    /**
     * @param {string|string[]} value
     * @returns {string|string[]}
     */
    render(value: string | string[], shouldRender?: boolean): string | string[];
    progress(shouldRender?: boolean): (value: any) => string | string[];
    /**
     *
     * @param {object} param0
     * @param {ChatMessage} param0.answer
     * @param {ChatMessage} param0.thoughts
     * @param {boolean} [param0.thinking=false]
     */
    thinking({ answer, thoughts, thinking }: {
        answer: ChatMessage;
        thoughts: ChatMessage;
        thinking?: boolean | undefined;
    }): (render?: boolean) => string | string[];
    welcome({ cwd }: {
        cwd: any;
    }): (render?: boolean) => string | string[];
    chatPreview({ chat }: {
        chat: any;
    }): (render?: boolean) => string | string[];
    waitingForChanges({ includes, processed, tests }: {
        includes: any;
        processed: any;
        tests: any;
    }): (render?: boolean) => string | string[];
    ask({ label }: {
        label: any;
    }): Promise<void>;
    /**
     * @param {object} context
     * @param {ChatMessage} context.chat
     * @param {string|string[]} [context.label="Found existing chat, do you want to continue it?"]
     * @returns {boolean}
     */
    askToContinueWithIncompleteChat(context: {
        chat: ChatMessage;
        label?: string | string[] | undefined;
    }): boolean;
}
declare class Window {
    constructor(stdout: any);
    stdout: any;
    get width(): any;
    get height(): any;
}
