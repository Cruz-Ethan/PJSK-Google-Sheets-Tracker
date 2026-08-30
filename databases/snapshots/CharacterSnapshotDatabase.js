import DatabaseHandler from "../generics/DatabaseHandler.js"
import CharacterDatabase from "../cards/CharacterDatabase.js"
import MissingValueError from "../../errors/MissingValueError.js"
import InvalidValueError from "../../errors/InvalidValueError.js"
import { getDate } from "../../utils/format.js"

class CharacterSnapshot {
    static #characterSnapshots = []

    #character
    #time
    #rank

    constructor(character, timeString, rank) {
        if (!character) throw new MissingValueError('CharacterSnapshot', 'character', character, timeString)
        if (!timeString) throw new MissingValueError('CharacterSnapshot', 'timeString', character, timeString)
        if (typeof rank !== "number") throw new MissingValueError('CharacterSnapshot', 'talentBoost', character, timeString)

        if (rank < 0) throw new InvalidValueError(
            'CharacterSnapshot',
            'rank',
            rank,
            'Rank must be positive.',
            character, timeString
        )

        this.#character = character
        this.#time = getDate(timeString)
        this.#rank = rank
        if (!CharacterSnapshot.#characterSnapshots) {
            CharacterSnapshot.#characterSnapshots = []
        }
        CharacterSnapshot.#characterSnapshots.push(this)
    }

    static getCharacterSnapshots() {
        return CharacterSnapshot.#characterSnapshots
    }

    get character() { return this.#character }
    get time() { return this.#time }
    get rank() { return this.#rank }

    toString() {
        return `${this.#character} (${this.#time})`
    }

    matches(character) {
        return this.#character === character
    }
}

export default class CharacterSnapshotDatabase {
    static #instance
    static #sheetName = 'character_snapshots'

    static #characterDatabase

    static async getInstance(googleSheetsID) {
        if (!CharacterSnapshotDatabase.#instance) {
            if (!CharacterSnapshotDatabase.#sheetName) {
                CharacterSnapshotDatabase.#sheetName = 'character_snapshots'
            }

            if (!CharacterSnapshotDatabase.#characterDatabase) {
                CharacterSnapshotDatabase.#characterDatabase = await CharacterDatabase.getInstance(googleSheetsID)
            }

            CharacterSnapshotDatabase.#instance = new CharacterSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CharacterSnapshotDatabase.#sheetName, false)
            rows.forEach(row => new CharacterSnapshot(
                CharacterSnapshotDatabase.#characterDatabase.getCharacter(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return CharacterSnapshotDatabase.#instance
    }

    getAllCharacterSnapshots() {
        return [...CharacterSnapshot.getCharacterSnapshots()]
    }

    getCharacterSnapshots(character) {
        const characterSnapshots = this.getAllCharacterSnapshots()
        return characterSnapshots.filter(characterSnapshot => characterSnapshot.character === character)
    }
}