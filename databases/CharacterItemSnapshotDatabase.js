import DatabaseHandler from "./DatabaseHandler.js"
import CharacterAreaItemDatabase from "./CharacterAreaItemDatabase.js"
import InvalidValueError from "../errors/InvalidValueError.js"
import MissingValueError from "../errors/MissingValueError.js"
import { getDate } from "../utils/format.js"

class CharacterItemSnapshot {
    static #characterItemSnapshots = []

    #characterAreaItem
    #time
    #talentBoostPercentage

    constructor(characterAreaItem, timeString, talentBoost) {
        if(!characterAreaItem) throw new MissingValueError('CharacterItemSnapshot', 'characterAreaItem', characterAreaItem, timeString)
        if(!timeString) throw new MissingValueError('CharacterItemSnapshot', 'timeString', characterAreaItem, timeString)
        if(!talentBoost) throw new MissingValueError('CharacterItemSnapshot', 'talentBoost', characterAreaItem, timeString)

        if(talentBoost < 0) throw new InvalidValueError(
            CharacterItemSnapshot,
            'talentBoost',
            talentBoost,
            'Talent boost must be positive.',
            characterAreaItem, timeString
        )

        this.#characterAreaItem = characterAreaItem
        this.#time = getDate(timeString)
        this.#talentBoostPercentage = talentBoost * 100

        if(!CharacterItemSnapshot.#characterItemSnapshots) {
            CharacterItemSnapshot.#characterItemSnapshots = []
        }
        CharacterItemSnapshot.#characterItemSnapshots.push(this)
    }

    static getCharacterItemSnapshots() {
        return CharacterItemSnapshot.#characterItemSnapshots
    }

    get characterAreaItem() { return this.#characterAreaItem }
    get time() { return this.#time }
    get talentBoostPercentage() { return this.#talentBoostPercentage }

    toString() {
        return `${this.#characterAreaItem} (${this.#time})`
    }
}

export default class CharacterItemSnapshotDatabase {
    static #instance
    static #sheetName = 'character_item_snapshots'

    static #characterAreaItemDatabase

    static async getInstance(googleSheetsID) {
        if(!CharacterItemSnapshotDatabase.#instance) {
            if(!CharacterItemSnapshotDatabase.#sheetName) {
                CharacterItemSnapshotDatabase.#sheetName = 'character_item_snapshots'
            }
            if(!CharacterItemSnapshotDatabase.#characterAreaItemDatabase) {
                CharacterItemSnapshotDatabase.#characterAreaItemDatabase = await CharacterAreaItemDatabase.getInstance(googleSheetsID)
            }

            CharacterItemSnapshotDatabase.#instance = new CharacterItemSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CharacterItemSnapshotDatabase.#sheetName, false)
            rows.forEach(row => new CharacterItemSnapshot(
                CharacterItemSnapshotDatabase.#characterAreaItemDatabase.getCharacterAreaItem(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return CharacterItemSnapshotDatabase.#instance
    }

    getAllCharacterItemSnapshots() {
        return [...CharacterItemSnapshot.getCharacterItemSnapshots()]
    }

    getCharacterAreaItemSnapshots(characterAreaItem) {
        const characterItemSnapshots = this.getAllCharacterItemSnapshots()
        return characterItemSnapshots.filter(characterItemSnapshot => characterItemSnapshot.characterAreaItem === characterAreaItem)
    }
}