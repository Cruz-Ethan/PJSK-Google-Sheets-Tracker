import DatabaseHandler from "../generics/DatabaseHandler.js"
import UnitAreaItemDatabase from "../items/UnitAreaItemDatabase.js"
import MissingValueError from "../../errors/MissingValueError.js"
import InvalidValueError from "../../errors/InvalidValueError.js"
import { getDate } from "../../utils/format.js"

class UnitItemSnapshot {
    static #unitItemSnapshots = []

    #unitAreaItem
    #time
    #talentBoostPercentage

    constructor(unitAreaItem, timeString, talentBoost) {
        if (!unitAreaItem) throw new MissingValueError('UnitItemSnapshot', 'unitAreaItem', unitAreaItem, timeString)
        if (!timeString) throw new MissingValueError('UnitItemSnapshot', 'timeString', unitAreaItem, timeString)
        if (!talentBoost) throw new MissingValueError('UnitItemSnapshot', 'talentBoost', unitAreaItem, timeString)

        if (talentBoost < 0) throw new InvalidValueError(
            UnitItemSnapshot,
            'talentBoost',
            talentBoost,
            'Talent boost must be positive.',
            unitAreaItem, timeString
        )

        this.#unitAreaItem = unitAreaItem
        this.#time = getDate(timeString)
        this.#talentBoostPercentage = talentBoost * 100

        if (!UnitItemSnapshot.#unitItemSnapshots) {
            UnitItemSnapshot.#unitItemSnapshots = []
        }
        UnitItemSnapshot.#unitItemSnapshots.push(this)
    }

    static getUnitItemSnapshots() {
        return UnitItemSnapshot.#unitItemSnapshots
    }

    get unitAreaItem() { return this.#unitAreaItem }
    get time() { return this.#time }
    get talentBoostPercentage() { return this.#talentBoostPercentage }

    toString() {
        return `${this.unitAreaItem} (${this.#time})`
    }

    matches(unitAreaItem) {
        return this.#unitAreaItem === unitAreaItem
    }
}

export default class UnitItemSnapshotDatabase {
    static #instance
    static #sheetName = 'unit_item_snapshots'

    static #unitAreaItemDatabase

    static async getInstance(googleSheetsID) {
        if (!UnitItemSnapshotDatabase.#instance) {
            if (!UnitItemSnapshotDatabase.#sheetName) {
                UnitItemSnapshotDatabase.#sheetName = 'unit_item_snapshots'
            }
            if (!UnitItemSnapshotDatabase.#unitAreaItemDatabase) {
                UnitItemSnapshotDatabase.#unitAreaItemDatabase = await UnitAreaItemDatabase.getInstance(googleSheetsID)
            }

            UnitItemSnapshotDatabase.#instance = new UnitItemSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(UnitItemSnapshotDatabase.#sheetName, false)
            rows.forEach(row => new UnitItemSnapshot(
                UnitItemSnapshotDatabase.#unitAreaItemDatabase.getUnitAreaItem(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return UnitItemSnapshotDatabase.#instance
    }

    getAllUnitItemSnapshots() {
        return [...UnitItemSnapshot.getUnitItemSnapshots()]
    }

    getUnitAreaItemSnapshots(unitAreaItem) {
        const unitItemSnapshots = this.getAllUnitItemSnapshots()
        return unitItemSnapshots.filter(unitItemSnapshot => unitItemSnapshot.unitAreaItem === unitAreaItem)
    }
}