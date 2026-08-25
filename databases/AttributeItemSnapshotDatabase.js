import DatabaseHandler from "./DatabaseHandler.js"
import AttributeAreaItemDatabase from "./AttributeAreaItemDatabase.js"
import { getDate } from "../utils/format.js"

class AttributeItemSnapshot {
    static #attributeItemSnapshots = []

    constructor(attributeAreaItem, timeString, talentBoost) {
        this.attributeAreaItem = attributeAreaItem
        this.time = getDate(timeString)
        this.talentBoostPercentage = talentBoost * 100

        if(!AttributeItemSnapshot.attributeItemSnapshots) {
            AttributeItemSnapshot.attributeItemSnapshots = []
        }
        AttributeItemSnapshot.attributeItemSnapshots.push(this)
    }

    static getAttributeItemSnapshots() {
        return AttributeItemSnapshot.attributeItemSnapshots
    }
}

export default class AttributeItemSnapshotDatabase {
    static #instance
    static #sheetName = 'attribute_item_snapshots'

    static #attributeAreaItemDatabase

    static async getInstance(googleSheetsID) {
        if(!AttributeItemSnapshotDatabase.instance) {
            if(!AttributeItemSnapshotDatabase.sheetName) {
                AttributeItemSnapshotDatabase.sheetName = 'attribute_item_snapshots'
            }
            if(!AttributeItemSnapshotDatabase.attributeAreaItemDatabase) {
                AttributeItemSnapshotDatabase.attributeAreaItemDatabase = await AttributeAreaItemDatabase.getInstance(googleSheetsID)
            }

            AttributeItemSnapshotDatabase.instance = new AttributeItemSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(AttributeItemSnapshotDatabase.sheetName, false)
            rows.forEach(row => new AttributeItemSnapshot(
                AttributeItemSnapshotDatabase.attributeAreaItemDatabase.getAttributeAreaItem(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return AttributeItemSnapshotDatabase.instance
    }

    getAllAttributeItemSnapshots() {
        return [...AttributeItemSnapshot.getAttributeItemSnapshots()]
    }

    getAttributeAreaItemSnapshots(attributeAreaItem) {
        const attributeItemSnapshots = this.getAllAttributeItemSnapshots()
        return attributeItemSnapshots.filter(attributeItemSnapshot => attributeItemSnapshot.attributeAreaItem === attributeAreaItem)
    }
}