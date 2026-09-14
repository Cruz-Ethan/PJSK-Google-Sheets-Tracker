import MissingReferenceError from "../../errors/MissingReferenceError.js"
import MissingValueError from "../../errors/MissingValueError.js"
import DatabaseHandler from "../generics/DatabaseHandler.js"

class Difficulty {
    static #difficulties = []

    #difficulty

    constructor(difficulty) {
        if(!difficulty) throw new MissingValueError('Difficulty', 'difficulty', difficulty)

        this.#difficulty = difficulty
        if(!Difficulty.#difficulties) {
            Difficulty.#difficulties = []
        }
        Difficulty.#difficulties.push(this)
    }

    static getDifficulties() {
        return Difficulty.#difficulties
    }

    get difficulty() { return this.#difficulty }
    get name() { return this.#difficulty }

    toString() {
        return this.#difficulty
    }
}

export default class DifficultyDatabase {
    static #instance
    static #sheetName = 'difficulties'

    static async getInstance(googleSheetsID) {
        if(!DifficultyDatabase.#instance) {
            if(!DifficultyDatabase.#sheetName) {
                DifficultyDatabase.#sheetName = 'difficulties'
            }
            DifficultyDatabase.#instance = new DifficultyDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(DifficultyDatabase.#sheetName)
            rows.forEach(row => new Difficulty(row.c[0].v))
        }
        return DifficultyDatabase.#instance
    }

    getAllDifficulties() {
        return [...Difficulty.getDifficulties()]
    }

    getDifficulty(difficultyName) {
        const difficulties = this.getAllDifficulties()
        const difficulty = difficulties.find(difficulty => difficulty.difficulty === difficultyName)
        if(!difficulty) throw new MissingReferenceError('Difficulty', difficultyName)
        return difficulty
    }
}