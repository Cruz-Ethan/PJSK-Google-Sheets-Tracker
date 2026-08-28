import MissingReferenceError from "../errors/MissingReferenceError.js"
import MissingValueError from "../errors/MissingValueError.js"
import DatabaseHandler from "./DatabaseHandler.js"

class ShowType {
    static #showTypes = []

    #showType

    constructor(showType) {
        if(!showType) throw new MissingValueError('ShowType', 'showType', showType)

        this.#showType = showType
        if(!ShowType.#showTypes) {
            ShowType.#showTypes = []
        }
        ShowType.#showTypes.push(this)
    }

    static getShowTypes() {
        return ShowType.#showTypes
    }

    get showType() { return this.#showType }
}

export default class ShowTypeDatabase {
    static #instance
    static #sheetName = 'show_types'

    static async getInstance(googleSheetsID) {
        if(!ShowTypeDatabase.#instance) {
            if(!ShowTypeDatabase.#sheetName) {
                ShowTypeDatabase.#sheetName = 'show_types'
            }
            ShowTypeDatabase.#instance = new ShowTypeDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(ShowTypeDatabase.#sheetName)
            rows.forEach(row => new ShowType(row.c[0].v))
        }
        return ShowTypeDatabase.#instance
    }

    getAllShowTypes() {
        return [...ShowType.getShowTypes()]
    }

    getShowType(showTypeName) {
        const showTypes = this.getAllShowTypes()
        const showType = showTypes.find(showType => showType.showType === showTypeName)
        if(!showType) throw new MissingReferenceError('ShowType', showTypeName)
        return showType
    }
}