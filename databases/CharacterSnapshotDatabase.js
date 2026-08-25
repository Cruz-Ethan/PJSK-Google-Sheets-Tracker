import DatabaseHandler from "./DatabaseHandler.js"
import CharacterDatabase from "./CharacterDatabase.js"
import { getDate } from "../utils/format.js"

class CharacterSnapshot {
    static #characterSnapshots = []

    constructor(character, timeString, rank) {
        this.character = character
        this.time = getDate(timeString)
        this.rank = rank
        if(!CharacterSnapshot.characterSnapshots) {
            CharacterSnapshot.characterSnapshots = []
        }
        CharacterSnapshot.characterSnapshots.push(this)
    }

    static getCharacterSnapshots() {
        return CharacterSnapshot.characterSnapshots
    }
}

export default class CharacterSnapshotDatabase {
    static #instance
    static #sheetName = 'character_snapshots'

    static #characterDatabase

    static async getInstance(googleSheetsID) {
        if(!CharacterSnapshotDatabase.instance) {
            if(!CharacterSnapshotDatabase.sheetName) {
                CharacterSnapshotDatabase.sheetName = 'character_snapshots'
            }

            if(!CharacterSnapshotDatabase.characterDatabase) {
                CharacterSnapshotDatabase.characterDatabase = await CharacterDatabase.getInstance(googleSheetsID)
            }

            CharacterSnapshotDatabase.instance = new CharacterSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CharacterSnapshotDatabase.sheetName, false)
            rows.forEach(row => new CharacterSnapshot(
                CharacterSnapshotDatabase.characterDatabase.getCharacter(row.c[0].v),
                row.c[1].v,
                row.c[2].v
            ))
        }
        return CharacterSnapshotDatabase.instance
    }

    getAllCharacterSnapshots() {
        return [...CharacterSnapshot.getCharacterSnapshots()]
    }

    getCharacterSnapshots(character) {
        const characterSnapshots = this.getAllCharacterSnapshots()
        return characterSnapshots.filter(characterSnapshot => characterSnapshot.character === character)
    }
}