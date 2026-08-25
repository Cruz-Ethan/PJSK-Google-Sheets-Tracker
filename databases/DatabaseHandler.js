export default class DatabaseHandler {
    static #database

    static getDatabase(googleSheetsID) {
        if(DatabaseHandler.database) return DatabaseHandler.database
        DatabaseHandler.database = new Database(googleSheetsID)
        return DatabaseHandler.database
    }
}

class Database {
    constructor(googleSheetsID) {
        this.googleSheetsID = googleSheetsID
    }

    async getObjects(sheetName, shouldCutFirst=true) {
        const url = `https://docs.google.com/spreadsheets/d/${this.googleSheetsID}/gviz/tq?sheet=${sheetName}`
        const response = await fetch(url)
        const text = await response.text()
        const parsedText = text.substring(47).slice(0, -2)
        const table = JSON.parse(parsedText).table
        if(shouldCutFirst) table.rows.shift()
        const rows = table.rows
        return rows.filter(row => row.c[0])
    }
}