export default class MissingReferenceError extends Error {
    constructor(className, ...values) {
        super(`A(n) ${className} couldn't be found with values ${values}.`)
    }
}