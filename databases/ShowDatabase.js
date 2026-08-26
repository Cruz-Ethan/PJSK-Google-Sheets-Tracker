import DatabaseHandler from "./DatabaseHandler.js"
import SongDatabase from "./SongDatabase.js"
import DifficultyDatabase from "./DifficultyDatabase.js"
import ShowTypeDatabase from "./ShowTypeDatabase.js"
import TeamDatabase from "./TeamDatabase.js"
import ChartDatabase from "./ChartDatabase.js"
import { getDate } from "../utils/format.js"

class Show {
    static #shows = []

    #show
    #song
    #difficulty
    #showType
    #noteSpeed
    #team
    #time
    #score
    #rank
    #failed
    #interruptions
    #attempts
    #perfects
    #greats
    #goods
    #bads
    #misses
    #longestCombo

    constructor(
        show,
        song,
        difficulty,
        showType,
        noteSpeed,
        team,
        timeString,
        score,
        rank,
        failed,
        interruptions,
        attempts,
        perfects,
        greats,
        goods,
        bads,
        misses,
        longestCombo
    ) {
        this.#show = show
        this.#song = song
        this.#difficulty = difficulty
        this.#showType = showType
        this.#noteSpeed = noteSpeed
        this.#team = team
        this.#time = getDate(timeString)
        this.#score = score
        this.#rank = rank
        this.#failed = failed
        this.#interruptions = interruptions
        this.#attempts = attempts
        this.#perfects = perfects
        this.#greats = greats
        this.#goods = goods
        this.#bads = bads
        this.#misses = misses
        this.#longestCombo = longestCombo

        if(!Show.shows) {
            Show.shows = []
        }
        Show.shows.push(this)
    }

    static getShows() {
        return Show.shows
    }

    get show() { return this.#show }
    get song() { return this.#song }
    get difficulty() { return this.#difficulty }
    get showType() { return this.#showType }
    get noteSpeed() { return this.#noteSpeed }
    get team() { return this.#team }
    get time() { return this.#time }
    get score() { return this.#score }
    get rank() { return this.#rank }
    get failed() { return this.#failed }
    get interruptions() { return this.#interruptions }
    get attempts() { return this.#attempts }
    get perfects() { return this.#perfects }
    get greats() { return this.#greats }
    get goods() { return this.#goods }
    get bads() { return this.#bads }
    get misses() { return this.#misses }
    get longestCombo() { return this.#longestCombo }
}

export default class ShowDatabase {
    static #instance
    static #sheetName = 'shows'

    static #songDatabase
    static #difficultyDatabase
    static #showTypeDatabase
    static #teamDatabase

    static async getInstance(googleSheetsID) {
        if(!ShowDatabase.instance) {
            if(!ShowDatabase.sheetName) {
                ShowDatabase.sheetName = 'shows'
            }
            if(!ShowDatabase.songDatabase) {
                ShowDatabase.songDatabase = await SongDatabase.getInstance(googleSheetsID)
            }
            if(!ShowDatabase.difficultyDatabase) {
                ShowDatabase.difficultyDatabase = await DifficultyDatabase.getInstance(googleSheetsID)
            }
            if(!ShowDatabase.showTypeDatabase) {
                ShowDatabase.showTypeDatabase = await ShowTypeDatabase.getInstance(googleSheetsID)
            }
            if(!ShowDatabase.teamDatabase) {
                ShowDatabase.teamDatabase = await TeamDatabase.getInstance(googleSheetsID)
            }

            ShowDatabase.instance = new ShowDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(ShowDatabase.sheetName, false)
            rows.forEach(row => new Show(
                row.c[0].v,
                ShowDatabase.songDatabase.getSong(row.c[1].v),
                ShowDatabase.difficultyDatabase.getDifficulty(row.c[2].v),
                ShowDatabase.showTypeDatabase.getShowType(row.c[3].v),
                row.c[4].v,
                ShowDatabase.teamDatabase.getTeam(row.c[5].v),
                row.c[6].v,
                row.c[7].v,
                row.c[8].v,
                row.c[9].v,
                row.c[10].v,
                row.c[11].v,
                row.c[12].v,
                row.c[13].v,
                row.c[14].v,
                row.c[15].v,
                row.c[16].v,
                row.c[17].v,
            ))
        }
        return ShowDatabase.instance
    }

    getAllShows() {
        return [...Show.getShows()]
    }

    getShow(showID) {
        const shows = this.getAllShows()
        return shows.find(show => show.show === showID)
    }
}