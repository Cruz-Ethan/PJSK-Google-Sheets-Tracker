import MissingReferenceError from "../errors/MissingReferenceError.js"
import MissingValueError from "../errors/MissingValueError.js"
import DatabaseHandler from "./DatabaseHandler.js"
import SupportUnitDatabase from "./SupportUnitDatabase.js"

class Character {
    static #characters = []
    #character
    #imageUrl
    #supportUnit

    constructor(character, imageUrl, supportUnit) {
        if(!character) throw new MissingValueError('Character', 'character', character)
        if(!imageUrl) throw new MissingValueError('Character', 'imageUrl', character)
        if(!supportUnit) throw new MissingValueError('Character', 'supportUnit', character)

        this.#character = character
        this.#imageUrl = imageUrl
        this.#supportUnit = supportUnit

        if(!Character.#characters) {
            Character.#characters = []
        }
        Character.#characters.push(this)
    }

    static getCharacters() {
        return Character.#characters
    }

    get character() {
        return this.#character
    }

    get imageUrl() {
        return this.#imageUrl
    }

    get supportUnit() {
        return this.#supportUnit
    }

    toString() {
        return this.#character
    }
}

export default class CharacterDatabase {
    static #instance
    static #sheetName = 'characters'

    static #supportUnitDatabase

    static async getInstance(googleSheetsID) {
        if(!CharacterDatabase.#instance) {
            if(!CharacterDatabase.#sheetName) {
                CharacterDatabase.#sheetName = 'characters'
            }
            if(!CharacterDatabase.#supportUnitDatabase) {
                CharacterDatabase.#supportUnitDatabase = await SupportUnitDatabase.getInstance(googleSheetsID)
            }

            CharacterDatabase.#instance = new CharacterDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CharacterDatabase.#sheetName)
            rows.forEach(row => new Character(
                row.c[0].v,
                row.c[1].v, 
                CharacterDatabase.#supportUnitDatabase.getSupportUnit(row.c[2].v)
            ))
        }
        return CharacterDatabase.#instance
    }

    getAllCharacters() {
        return [...Character.getCharacters()]
    }

    getCharacter(characterName) {
        const characters = this.getAllCharacters()
        const character = characters.find(character => character.character === characterName)
        if(!character) throw new MissingReferenceError('Character', characterName)
        return character
    }
}