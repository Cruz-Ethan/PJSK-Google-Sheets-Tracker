import getPrimaryKeyString from "../utils/primaryKey.js";

export default class MissingValueError extends Error {
    constructor(className, valueName, ...primaryKey) {
        super(`${getPrimaryKeyString(primaryKey)} (${className}) was created missing its ${valueName} value.`)
    }
}