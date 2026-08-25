import DatabaseHandler from "./DatabaseHandler.js"
import SongDatabase from "./SongDatabase.js"
import DifficultyDatabase from "./DifficultyDatabase.js"

class Chart {
    static #charts = []

    constructor(song, difficulty, level, length) {
        this.song = song
        this.difficulty = difficulty
        this.level = level
        this.length = length
        if(!Chart.charts) {
            Chart.charts = []
        }
        Chart.charts.push(this)
    }

    static getCharts() {
        return Chart.charts
    }
}

export default class ChartDatabase {
    static #instance
    static #sheetName = 'charts'

    static #songDatabase
    static #difficultyDatabase

    static async getInstance(googleSheetsID) {
        if(!ChartDatabase.instance) {
            if(!ChartDatabase.sheetName) {
                ChartDatabase.sheetName = 'charts'
            }
            if(!ChartDatabase.songDatabase) {
                ChartDatabase.songDatabase = await SongDatabase.getInstance(googleSheetsID)
            }
            if(!ChartDatabase.difficultyDatabase) {
                ChartDatabase.difficultyDatabase = await DifficultyDatabase.getInstance(googleSheetsID)
            }


            ChartDatabase.instance = new ChartDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(ChartDatabase.sheetName, false)
            rows.forEach(row => new Chart(
                ChartDatabase.songDatabase.getSong(row.c[0].v),
                ChartDatabase.difficultyDatabase.getDifficulty(row.c[1].v),
                row.c[2].v,
                row.c[3].v
            ))
        }
        return ChartDatabase.instance
    }

    getAllCharts() {
        return [...Chart.getCharts()]
    }

    getChart(song, difficulty) {
        const charts = this.getAllCharts()
        return charts.find(chart => chart.song === song && chart.difficulty === difficulty)
    }
}