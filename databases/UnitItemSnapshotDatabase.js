import DatabaseHandler from "./DatabaseHandler.js"
import UnitAreaItemDatabase from "./UnitAreaItemDatabase.js"
import { getDate } from "../utils/format.js"

class UnitItemSnapshot {
    static #unitItemSnapshots = []

    constructor(unitAreaItem, timeString, talentBoost) {
        this.unitAreaItem = unitAreaItem
        this.time = getDate(timeString)
        this.talentBoostPercentage = talentBoost * 100

        if(!UnitItemSnapshot.unitItemSnapshots) {
            UnitItemSnapshot.unitItemSnapshots = []
        }
        UnitItemSnapshot.unitItemSnapshots.push(this)
    }

    static getUnitItemSnapshots() {
        return UnitItemSnapshot.unitItemSnapshots
    }
}

export default class UnitItemSnapshotDatabase {
    static #instance
    static #sheetName = 'unit_item_snapshots'

    static #unitAreaItemDatabase

    static async getInstance(googleSheetsID) {
        if(!UnitItemSnapshotDatabase.instance) {
            if(!UnitItemSnapshotDatabase.sheetName) {
                UnitItemSnapshotDatabase.sheetName = 'unit_item_snapshots'
            }
            if(!UnitItemSnapshotDatabase.unitAreaItemDatabase) {
                UnitItemSnapshotDatabase.unitAreaItemDatabase = await UnitAreaItemDatabase.getInstance(googleSheetsID)
            }

            UnitItemSnapshotDatabase.instance = new UnitItemSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(UnitItemSnapshotDatabase.sheetName, false)
            rows.forEach(row => new UnitItemSnapshot(
                UnitItemSnapshotDatabase.unitAreaItemDatabase.getUnitAreaItem(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return UnitItemSnapshotDatabase.instance
    }

    getAllUnitItemSnapshots() {
        return [...UnitItemSnapshot.getUnitItemSnapshots()]
    }

    getUnitAreaItemSnapshots(unitAreaItem) {
        const unitItemSnapshots = this.getAllUnitItemSnapshots()
        return unitItemSnapshots.filter(unitItemSnapshot => unitItemSnapshot.unitAreaItem === unitAreaItem)
    }
}