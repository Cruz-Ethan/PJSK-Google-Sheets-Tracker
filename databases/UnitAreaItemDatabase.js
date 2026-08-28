import MissingReferenceError from "../errors/MissingReferenceError.js"
import MissingValueError from "../errors/MissingValueError.js"
import DatabaseHandler from "./DatabaseHandler.js"
import SupportUnitDatabase from "./SupportUnitDatabase.js"

class UnitAreaItem {
    static #unitAreaItems = []

    #unitAreaItem
    #supportUnit

    constructor(unitAreaItem, supportUnit) {
        if(!unitAreaItem) throw new MissingValueError('UnitAreaItem', 'unitAreaItem', unitAreaItem)
        if(!supportUnit) throw new MissingValueError('UnitAreaItem', 'supportUnit', unitAreaItem)

        this.#unitAreaItem = unitAreaItem
        this.#supportUnit = supportUnit

        if(!UnitAreaItem.#unitAreaItems) {
            UnitAreaItem.#unitAreaItems = []
        }
        UnitAreaItem.#unitAreaItems.push(this)
    }

    static getUnitAreaItems() {
        return UnitAreaItem.#unitAreaItems
    }

    get unitAreaItem() { return this.#unitAreaItem }
    get supportUnit() { return this.#supportUnit }

    toString() {
        return this.#unitAreaItem
    }
}

export default class UnitAreaItemDatabase {
    static #instance
    static #sheetName = 'unit_area_items'

    static #supportUnitDatabase

    static async getInstance(googleSheetsID) {
        if(!UnitAreaItemDatabase.#instance) {
            if(!UnitAreaItemDatabase.#sheetName) {
                UnitAreaItemDatabase.#sheetName = 'unit_area_items'
            }
            if(!UnitAreaItemDatabase.#supportUnitDatabase) {
                UnitAreaItemDatabase.#supportUnitDatabase = await SupportUnitDatabase.getInstance(googleSheetsID)
            }

            UnitAreaItemDatabase.#instance = new UnitAreaItemDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(UnitAreaItemDatabase.#sheetName)
            rows.forEach(row => new UnitAreaItem(
                row.c[0].v,
                UnitAreaItemDatabase.#supportUnitDatabase.getSupportUnit(row.c[1].v)
            ))
        }
        return UnitAreaItemDatabase.#instance
    }

    getAllUnitAreaItems() {
        return [...UnitAreaItem.getUnitAreaItems()]
    }

    getUnitAreaItem(unitAreaItemName) {
        const unitAreaItems = this.getAllUnitAreaItems()
        const unitAreaItem = unitAreaItems.find(unitAreaItem => unitAreaItem.unitAreaItem === unitAreaItemName)
        if(!unitAreaItem) throw new MissingReferenceError('UnitAreaItem', unitAreaItemName)
        return unitAreaItem
    }
}