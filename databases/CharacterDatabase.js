import DatabaseHandler from "./DatabaseHandler.js"

class Character {
    static #characters = []
    #character
    #imageUrl
    #supportUnit

    constructor(character, imageUrl, supportUnit) {
        this.#character = character
        this.#imageUrl = imageUrl
        this.#supportUnit = supportUnit

        if(!Character.characters) {
            Character.characters = []
        }
        Character.characters.push(this)
    }

    static getCharacters() {
        return Character.characters
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
}

export default class CharacterDatabase {
    static #instance
    static #sheetName = 'characters'

    static async getInstance(googleSheetsID) {
        if(!CharacterDatabase.instance) {
            if(!CharacterDatabase.sheetName) {
                CharacterDatabase.sheetName = 'characters'
            }
            CharacterDatabase.instance = new CharacterDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CharacterDatabase.sheetName)
            rows.forEach(row => new Character(row.c[0].v, row.c[1].v, row.c[2].v))
        }
        return CharacterDatabase.instance
    }

    getAllCharacters() {
        return [...Character.getCharacters()]
    }

    getCharacter(characterName) {
        const characters = this.getAllCharacters()
        return characters.find(character => character.character === characterName)
    }
}