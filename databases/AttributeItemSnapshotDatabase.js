import DatabaseHandler from "./DatabaseHandler.js"
import AttributeAreaItemDatabase from "./AttributeAreaItemDatabase.js"
import { getDate } from "../utils/format.js"
import MissingValueError from "../errors/MissingValueError.js"
import InvalidValueError from "../errors/InvalidValueError.js"

class AttributeItemSnapshot {
    static #attributeItemSnapshots = []
    #attributeAreaItem
    #time
    #talentBoostPercentage

    constructor(attributeAreaItem, timeString, talentBoost) {
        if(!attributeAreaItem) throw new MissingValueError('AttributeItemSnapshot', 'attributeAreaItem', attributeAreaItem, timeString)
        if(!timeString) throw new MissingValueError('AttributeItemSnapshot', 'timeString', attributeAreaItem, timeString)
        if(!talentBoost) throw new MissingValueError('AttributeItemSnapshot', 'talentBoost', attributeAreaItem, timeString)

        if(talentBoost < 0) throw new InvalidValueError(
            AttributeItemSnapshot,
            'talentBoost',
            talentBoost,
            'Talent boost must be positive.',
            attributeAreaItem, timeString
        )

        this.#attributeAreaItem = attributeAreaItem
        this.#time = getDate(timeString)
        this.#talentBoostPercentage = talentBoost * 100

        if(!AttributeItemSnapshot.#attributeItemSnapshots) {
            AttributeItemSnapshot.#attributeItemSnapshots = []
        }
        AttributeItemSnapshot.#attributeItemSnapshots.push(this)
    }

    static getAttributeItemSnapshots() {
        return AttributeItemSnapshot.#attributeItemSnapshots
    }

    get attributeAreaItem() {
        return this.#attributeAreaItem
    }

    get time() {
        return this.#time
    }

    get talentBoost() {
        return this.#talentBoostPercentage
    }

    toString() {
        return `${this.#attributeAreaItem} (${this.#time})`
    }
}

export default class AttributeItemSnapshotDatabase {
    static #instance
    static #sheetName = 'attribute_item_snapshots'

    static #attributeAreaItemDatabase

    static async getInstance(googleSheetsID) {
        if(!AttributeItemSnapshotDatabase.#instance) {
            if(!AttributeItemSnapshotDatabase.#sheetName) {
                AttributeItemSnapshotDatabase.#sheetName = 'attribute_item_snapshots'
            }
            if(!AttributeItemSnapshotDatabase.#attributeAreaItemDatabase) {
                AttributeItemSnapshotDatabase.#attributeAreaItemDatabase = await AttributeAreaItemDatabase.getInstance(googleSheetsID)
            }

            AttributeItemSnapshotDatabase.#instance = new AttributeItemSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(AttributeItemSnapshotDatabase.#sheetName, false)
            rows.forEach(row => new AttributeItemSnapshot(
                AttributeItemSnapshotDatabase.#attributeAreaItemDatabase.getAttributeAreaItem(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return AttributeItemSnapshotDatabase.#instance
    }

    getAllAttributeItemSnapshots() {
        return [...AttributeItemSnapshot.getAttributeItemSnapshots()]
    }

    getAttributeAreaItemSnapshots(attributeAreaItem) {
        const attributeItemSnapshots = this.getAllAttributeItemSnapshots()
        return attributeItemSnapshots.filter(attributeItemSnapshot => attributeItemSnapshot.attributeAreaItem === attributeAreaItem)
    }
}