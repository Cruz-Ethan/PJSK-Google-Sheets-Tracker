import DatabaseHandler from "../generics/DatabaseHandler.js"
import SongDatabase from "./SongDatabase.js"
import DifficultyDatabase from "./DifficultyDatabase.js"
import MissingReferenceError from "../../errors/MissingReferenceError.js"
import MissingValueError from "../../errors/MissingValueError.js"
import InvalidValueError from "../../errors/InvalidValueError.js"

class Chart {
    static #charts = []

    static #minSongLevel = 5
    static #maxSongLevel = 38

    #song
    #difficulty
    #level
    #length

    constructor(song, difficulty, level, length) {
        if(!song) throw new MissingValueError('Chart', 'song', song, difficulty)
        if(!difficulty) throw new MissingValueError('Chart', 'difficulty', song, difficulty)
        if(!level) throw new MissingValueError('Chart', 'level', song, difficulty)
        if(!length) throw new MissingValueError('Chart', 'length', song, difficulty)

        if(level < Chart.#minSongLevel || level > Chart.#maxSongLevel) throw new InvalidValueError(
            'Chart',
            'level',
            level,
            `Song level must be between ${Chart.#minSongLevel} and ${Chart.#maxSongLevel}.`,
            song,
            difficulty
        )

        if(length < 0) throw new InvalidValueError(
            'Chart', 'length', length, 'Chart length must be positive.', song, difficulty
        )

        this.#song = song
        this.#difficulty = difficulty
        this.#level = level
        this.#length = length
        if(!Chart.#charts) {
            Chart.#charts = []
        }
        Chart.#charts.push(this)
    }

    static getCharts() {
        return Chart.#charts
    }

    get song() { return this.#song }
    get difficulty() { return this.#difficulty }
    get level() { return this.#level }
    get length() { return this.#length }

    toString() {
        return `${this.#song} (${this.difficulty})`
    }
}

export default class ChartDatabase {
    static #instance
    static #sheetName = 'charts'

    static #songDatabase
    static #difficultyDatabase

    static async getInstance(googleSheetsID) {
        if(!ChartDatabase.#instance) {
            if(!ChartDatabase.#sheetName) {
                ChartDatabase.#sheetName = 'charts'
            }
            if(!ChartDatabase.#songDatabase) {
                ChartDatabase.#songDatabase = await SongDatabase.getInstance(googleSheetsID)
            }
            if(!ChartDatabase.#difficultyDatabase) {
                ChartDatabase.#difficultyDatabase = await DifficultyDatabase.getInstance(googleSheetsID)
            }


            ChartDatabase.#instance = new ChartDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(ChartDatabase.#sheetName, false)
            rows.forEach(row => new Chart(
                ChartDatabase.#songDatabase.getSong(row.c[0].v),
                ChartDatabase.#difficultyDatabase.getDifficulty(row.c[1].v),
                row.c[2].v,
                row.c[3].v
            ))
        }
        return ChartDatabase.#instance
    }

    getAllCharts() {
        return [...Chart.getCharts()]
    }

    getChart(song, difficulty) {
        const charts = this.getAllCharts()
        const chart = charts.find(chart => chart.song === song && chart.difficulty === difficulty)
        if(!chart) throw new MissingReferenceError('Chart', song, difficulty)
        return chart
    }
}