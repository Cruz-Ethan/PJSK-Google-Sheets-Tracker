import getPrimaryKeyString from "../utils/primaryKey.js";

export default class MissingReferenceError extends Error {
    constructor(className, ...primaryKey) {
        super(`A(n) ${className} couldn't be found with values ${getPrimaryKeyString(primaryKey)}.`)
    }
}