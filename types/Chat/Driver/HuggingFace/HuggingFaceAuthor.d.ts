export default HuggingFaceAuthor;
declare class HuggingFaceAuthor {
    constructor(props?: {});
    /** @type {string} */
    avatarUrl: string;
    /** @type {string} */
    fullname: string;
    /** @type {string} */
    name: string;
    /** @type {string} */
    type: string;
    /** @type {boolean} */
    isHf: boolean;
    /** @type {boolean} */
    isHfAdmin: boolean;
    /** @type {boolean} */
    isMod: boolean;
    /** @type {boolean} */
    isEnterprise: boolean;
    /** @type {number} */
    followerCount: number;
}
