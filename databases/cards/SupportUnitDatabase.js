import MissingReferenceError from "../../errors/MissingReferenceError.js"
import MissingValueError from "../../errors/MissingValueError.js"
import DatabaseHandler from "../generics/DatabaseHandler.js"

class SupportUnit {
    static #supportUnits = []

    #supportUnit

    constructor(supportUnit) {
        if(!supportUnit) throw new MissingValueError('SupportUnit', 'supportUnit', supportUnit)

        this.#supportUnit = supportUnit
        if(!SupportUnit.#supportUnits) {
            SupportUnit.#supportUnits = []
        }
        SupportUnit.#supportUnits.push(this)
    }

    static getSupportUnits() {
        return SupportUnit.#supportUnits
    }

    get supportUnit() { return this.#supportUnit }

    toString() {
        return this.#supportUnit
    }
}

export default class SupportUnitDatabase {
    static #instance
    static #sheetName = 'support_units'

    static async getInstance(googleSheetsID) {
        if(!SupportUnitDatabase.#instance) {
            if(!SupportUnitDatabase.#sheetName) {
                SupportUnitDatabase.#sheetName = 'support_units'
            }
            SupportUnitDatabase.#instance = new SupportUnitDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SupportUnitDatabase.#sheetName)
            rows.forEach(row => new SupportUnit(row.c[0].v))
        }
        return SupportUnitDatabase.#instance
    }

    getAllSupportUnits() {
        return [...SupportUnit.getSupportUnits()]
    }

    getSupportUnit(supportUnitName) {
        const supportUnits = this.getAllSupportUnits()
        const supportUnit = supportUnits.find(supportUnit => supportUnit.supportUnit === supportUnitName)
        if(!supportUnit) throw new MissingReferenceError('SupportUnit', supportUnitName)
        return supportUnit
    }
}