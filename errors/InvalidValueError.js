import getPrimaryKeyString from "../utils/primaryKey.js"

export default class InvalidValueError extends Error {
    constructor(className, valueName, value, requirement, ...primaryKey) {
        super(`${getPrimaryKeyString(primaryKey)} (${className}) was created with an invalid ${valueName} value.
            Value: ${value}
            Requirement: ${requirement}`)
    }
}