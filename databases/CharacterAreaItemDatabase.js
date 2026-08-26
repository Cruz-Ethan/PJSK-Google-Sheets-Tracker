import DatabaseHandler from "./DatabaseHandler.js"
import CharacterDatabase from "./CharacterDatabase.js"

class CharacterAreaItem {
    static #characterAreaItems = []

    #characterAreaItem
    #character

    constructor(characterAreaItem, character) {
        this.#characterAreaItem = characterAreaItem
        this.#character = character

        if(!CharacterAreaItem.characterAreaItems) {
            CharacterAreaItem.characterAreaItems = []
        }
        CharacterAreaItem.characterAreaItems.push(this)
    }

    static getCharacterAreaItems() {
        return CharacterAreaItem.characterAreaItems
    }

    get characterAreaItem() { return this.#characterAreaItem }
    get character() { return this.#character }
}

export default class CharacterAreaItemDatabase {
    static #instance
    static #sheetName = 'character_area_items'

    static #characterDatabase

    static async getInstance(googleSheetsID) {
        if(!CharacterAreaItemDatabase.instance) {
            if(!CharacterAreaItemDatabase.sheetName) {
                CharacterAreaItemDatabase.sheetName = 'character_area_items'
            }
            if(!CharacterAreaItemDatabase.characterDatabase) {
                CharacterAreaItemDatabase.characterDatabase = await CharacterDatabase.getInstance(googleSheetsID)
            }

            CharacterAreaItemDatabase.instance = new CharacterAreaItemDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CharacterAreaItemDatabase.sheetName)
            rows.forEach(row => new CharacterAreaItem(
                row.c[0].v,
                CharacterAreaItemDatabase.characterDatabase.getCharacter(row.c[1].v)
            ))
        }
        return CharacterAreaItemDatabase.instance
    }

    getAllCharacterAreaItems() {
        return [...CharacterAreaItem.getCharacterAreaItems()]
    }

    getCharacterAreaItem(characterAreaItemName) {
        const characterAreaItems = this.getAllCharacterAreaItems()
        return characterAreaItems.find(characterAreaItem => characterAreaItem.characterAreaItem === characterAreaItemName)
    }
}