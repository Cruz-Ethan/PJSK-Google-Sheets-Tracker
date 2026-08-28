export default class InvalidIDError extends Error {
    constructor(googleSheetsID) {
        super(`The ID "${googleSheetsID}" was not valid.`)
    }
}