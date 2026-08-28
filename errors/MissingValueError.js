export default class MissingValueError extends Error {
    constructor(className, valueName, ...primaryKey) {
        super(`${primaryKey} (${className}) was created missing its ${valueName} value.`)
    }
}