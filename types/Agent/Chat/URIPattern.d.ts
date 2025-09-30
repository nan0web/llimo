export default URIPattern;
declare class URIPattern {
    /**
     * Creates a new URIPattern instance
     * @param {string} input - The URI pattern string
     */
    constructor(input: string);
    /** @type {string} */
    uri: string;
    /**
     * Checks if the URI is remote (contains a scheme like http:// or https://)
     * @returns {boolean} - True if URI is remote, false otherwise
     */
    get isRemote(): boolean;
    /**
     * Checks if the URI is local (not remote)
     * @returns {boolean} - True if URI is local, false otherwise
     */
    get isLocal(): boolean;
    /**
     * Checks if the URI contains pattern matching characters (*, ?, [, {, !, +, [at])
     * @returns {boolean} - True if URI is a pattern, false otherwise
     */
    get isPattern(): boolean;
    /**
     * Gets the static prefix of the URI (everything before the first pattern character)
     * @returns {string} - The static prefix string
     */
    get staticPrefix(): string;
    /**
     * Filters an array of strings using micromatch against the URI pattern
     * @param {string[]} arr - An array of URI strings to filter
     * @returns {string[]} - Filtered array of matching URIs
     */
    filter(arr?: string[]): string[];
}
