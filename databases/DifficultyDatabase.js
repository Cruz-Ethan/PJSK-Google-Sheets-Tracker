import DatabaseHandler from "./DatabaseHandler.js"

class Difficulty {
    static #difficulties = []

    constructor(difficulty) {
        this.difficulty = difficulty
        if(!Difficulty.difficulties) {
            Difficulty.difficulties = []
        }
        Difficulty.difficulties.push(this)
    }

    static getDifficulties() {
        return Difficulty.difficulties
    }
}

export default class DifficultyDatabase {
    static #instance
    static #sheetName = 'difficulties'

    static async getInstance(googleSheetsID) {
        if(!DifficultyDatabase.instance) {
            if(!DifficultyDatabase.sheetName) {
                DifficultyDatabase.sheetName = 'difficulties'
            }
            DifficultyDatabase.instance = new DifficultyDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(DifficultyDatabase.sheetName)
            rows.forEach(row => new Difficulty(row.c[0].v))
        }
        return DifficultyDatabase.instance
    }

    getAllDifficulties() {
        return [...Difficulty.getDifficulties()]
    }

    getDifficulty(difficultyName) {
        const difficulties = this.getAllDifficulties()
        return difficulties.find(difficulty => difficulty.difficulty === difficultyName)
    }
}