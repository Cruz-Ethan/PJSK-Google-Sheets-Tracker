import MissingReferenceError from "../errors/MissingReferenceError.js"
import MissingValueError from "../errors/MissingValueError.js"
import DatabaseHandler from "./DatabaseHandler.js"

class Rarity {
    static #rarities = []

    #rarity

    constructor(rarity) {
        if(!rarity) throw new MissingValueError('Rarity', 'rarity', rarity)

        this.#rarity = rarity
        if(!Rarity.#rarities) {
            Rarity.#rarities = []
        }
        Rarity.#rarities.push(this)
    }

    static getRarities() {
        return Rarity.#rarities
    }

    get rarity() { return this.#rarity }

    toString() {
        return this.#rarity
    }
}

export default class RarityDatabase {
    static #instance
    static #sheetName = 'rarities'

    static async getInstance(googleSheetsID) {
        if(!RarityDatabase.#instance) {
            if(!RarityDatabase.#sheetName) {
                RarityDatabase.#sheetName = 'rarities'
            }
            RarityDatabase.#instance = new RarityDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(RarityDatabase.#sheetName)
            rows.forEach(row => new Rarity(row.c[0].v))
        }
        return RarityDatabase.#instance
    }

    getAllRarities() {
        return [...Rarity.getRarities()]
    }

    getRarity(rarityName) {
        const rarities = this.getAllRarities()
        const rarity = rarities.find(rarity => rarity.rarity === rarityName)
        if(!rarity) throw new MissingReferenceError('Rarity', rarityName)
        return rarity
    }
}