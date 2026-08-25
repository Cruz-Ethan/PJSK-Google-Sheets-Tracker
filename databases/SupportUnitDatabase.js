import DatabaseHandler from "./DatabaseHandler.js"

class SupportUnit {
    static #supportUnits = []

    constructor(supportUnit) {
        this.supportUnit = supportUnit
        if(!SupportUnit.supportUnits) {
            SupportUnit.supportUnits = []
        }
        SupportUnit.supportUnits.push(this)
    }

    static getSupportUnits() {
        return SupportUnit.supportUnits
    }
}

export default class SupportUnitDatabase {
    static #instance
    static #sheetName = 'support_units'

    static async getInstance(googleSheetsID) {
        if(!SupportUnitDatabase.instance) {
            if(!SupportUnitDatabase.sheetName) {
                SupportUnitDatabase.sheetName = 'support_units'
            }
            SupportUnitDatabase.instance = new SupportUnitDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SupportUnitDatabase.sheetName)
            rows.forEach(row => new SupportUnit(row.c[0].v))
        }
        return SupportUnitDatabase.instance
    }

    getAllSupportUnits() {
        return [...SupportUnit.getSupportUnits()]
    }

    getSupportUnit(supportUnitName) {
        const supportUnits = this.getAllSupportUnits()
        return supportUnits.find(supportUnit => supportUnit.supportUnit === supportUnitName)
    }
}