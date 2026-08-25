import DatabaseHandler from "./DatabaseHandler.js"

class ShowType {
    static #showTypes = []

    constructor(showType) {
        this.showType = showType
        if(!ShowType.showTypes) {
            ShowType.showTypes = []
        }
        ShowType.showTypes.push(this)
    }

    static getShowTypes() {
        return ShowType.showTypes
    }
}

export default class ShowTypeDatabase {
    static #instance
    static #sheetName = 'show_types'

    static async getInstance(googleSheetsID) {
        if(!ShowTypeDatabase.instance) {
            if(!ShowTypeDatabase.sheetName) {
                ShowTypeDatabase.sheetName = 'show_types'
            }
            ShowTypeDatabase.instance = new ShowTypeDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(ShowTypeDatabase.sheetName)
            rows.forEach(row => new ShowType(row.c[0].v))
        }
        return ShowTypeDatabase.instance
    }

    getAllShowTypes() {
        return [...ShowType.getShowTypes()]
    }

    getShowType(showTypeName) {
        const showTypes = this.getAllShowTypes()
        return showTypes.find(showType => showType.showType === showTypeName)
    }
}