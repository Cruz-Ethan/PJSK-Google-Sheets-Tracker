import DatabaseHandler from "../generics/DatabaseHandler.js"
import SongDatabase from "./SongDatabase.js"
import DifficultyDatabase from "./DifficultyDatabase.js"
import ShowTypeDatabase from "./ShowTypeDatabase.js"
import TeamDatabase from "../cards/TeamDatabase.js"
import { getDate } from "../../utils/format.js"
import { getChartLength } from "../../utils/chartInfo.js"
import MissingValueError from "../../errors/MissingValueError.js"
import InvalidValueError from "../../errors/InvalidValueError.js"
import MissingReferenceError from "../../errors/MissingReferenceError.js"

class Show {
    static #shows = []

    static #minNoteSpeed = 1
    static #maxNoteSpeed = 12

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
        if(!show) throw new MissingValueError('Show', 'show', show)
        if(!song) throw new MissingValueError('Show', 'song', show)
        if(!difficulty) throw new MissingValueError('Show', 'difficulty', show)
        if(!noteSpeed) throw new MissingValueError('Show', 'noteSpeed', show)
        if(!timeString) throw new MissingValueError('Show', 'timeString', show)
        if(typeof score !== "number") throw new MissingValueError('Show', 'score', show)
        if(!rank) throw new MissingValueError('Show', 'rank', show)
        if(typeof failed !== "boolean") throw new MissingValueError('Show', 'failed', show)
        if(typeof interruptions !== "number") throw new MissingValueError('Show', 'interruptions', show)
        if(!attempts) throw new MissingValueError('Show', 'attempts', show)
        if(typeof perfects !== "number") throw new MissingValueError('Show', 'perfects', show)
        if(typeof greats !== "number") throw new MissingValueError('Show', 'greats', show)
        if(typeof goods !== "number") throw new MissingValueError('Show', 'goods', show)
        if(typeof bads !== "number") throw new MissingValueError('Show', 'bads', show)
        if(typeof misses !== "number") throw new MissingValueError('Show', 'misses', show)
        if(typeof longestCombo !== "number") throw new MissingValueError('Show', 'longestCombo', show)

        if(noteSpeed < Show.#minNoteSpeed || noteSpeed > Show.#maxNoteSpeed) {
            throw new InvalidValueError(
                'Show',
                'noteSpeed',
                noteSpeed,
                `Note speed must be between ${Show.#minNoteSpeed} and ${Show.#maxNoteSpeed}`,
                show
            )
        }

        if(score < 0) throw new InvalidValueError(
            'Show',
            'score',
            score,
            'The score must be positive.',
            show
        )

        if(
            rank !== 'S' &&
            rank !== 'A' &&
            rank !== 'B' &&
            rank !== 'C' &&
            rank !== 'D'
        ) throw new InvalidValueError(
            'Show',
            'rank',
            rank,
            'The rank must be S, A, B, C, or D.',
            show
        )

        if(interruptions < 0) throw new InvalidValueError(
            'Show',
            'interruptions',
            interruptions,
            'The number of interruptions cannot be negative.',
            show
        )

        if(attempts < 0) throw new InvalidValueError(
            'Show',
            'attempts',
            attempts,
            'The number of attempts cannot be negative.',
            show
        )

        if(perfects < 0) throw new InvalidValueError(
            'Show',
            'perfects',
            perfects,
            'The number of perfects cannot be negative.',
            show
        )

        if(greats < 0) throw new InvalidValueError(
            'Show',
            'greats',
            greats,
            'The number of greats cannot be negative.',
            show
        )

        if(goods < 0) throw new InvalidValueError(
            'Show',
            'goods',
            goods,
            'The number of goods cannot be negative.',
            show
        )

        if(bads < 0) throw new InvalidValueError(
            'Show',
            'bads',
            bads,
            'The number of bads cannot be negative.',
            show
        )

        if(misses < 0) throw new InvalidValueError(
            'Show',
            'misses',
            misses,
            'The number of misses cannot be negative.',
            show
        )

        if(perfects + greats < longestCombo) throw new InvalidValueError(
            'Show',
            'longestCombo',
            longestCombo,
            'The longest combo cannot be greater than the number of perfects and greats.',
            show
        )

        const chartLength = getChartLength(song, difficulty)
        if(perfects + greats + goods + bads + misses !== chartLength) throw new InvalidValueError(
            'Show',
            'chartLength',
            chartLength,
            'The number of notes must be equal to the sum of perfects, greats, etc.',
            show
        )

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

        if(!Show.#shows) {
            Show.#shows = []
        }
        Show.#shows.push(this)
    }

    static getShows() {
        return Show.#shows
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

    toString() {
        return this.#show
    }
}

export default class ShowDatabase {
    static #instance
    static #sheetName = 'shows'

    static #songDatabase
    static #difficultyDatabase
    static #showTypeDatabase
    static #teamDatabase

    static async getInstance(googleSheetsID) {
        if(!ShowDatabase.#instance) {
            if(!ShowDatabase.#sheetName) {
                ShowDatabase.#sheetName = 'shows'
            }
            if(!ShowDatabase.#songDatabase) {
                ShowDatabase.#songDatabase = await SongDatabase.getInstance(googleSheetsID)
            }
            if(!ShowDatabase.#difficultyDatabase) {
                ShowDatabase.#difficultyDatabase = await DifficultyDatabase.getInstance(googleSheetsID)
            }
            if(!ShowDatabase.#showTypeDatabase) {
                ShowDatabase.#showTypeDatabase = await ShowTypeDatabase.getInstance(googleSheetsID)
            }
            if(!ShowDatabase.#teamDatabase) {
                ShowDatabase.#teamDatabase = await TeamDatabase.getInstance(googleSheetsID)
            }

            ShowDatabase.#instance = new ShowDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(ShowDatabase.#sheetName, false)
            rows.forEach(row => new Show(
                row.c[0].v,
                ShowDatabase.#songDatabase.getSong(row.c[1].v),
                ShowDatabase.#difficultyDatabase.getDifficulty(row.c[2].v),
                ShowDatabase.#showTypeDatabase.getShowType(row.c[3].v),
                row.c[4].v,
                ShowDatabase.#teamDatabase.getTeam(row.c[5].v),
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
        return ShowDatabase.#instance
    }

    getAllShows() {
        return [...Show.getShows()]
    }

    getShow(showID) {
        const shows = this.getAllShows()
        const show = shows.find(show => show.show === showID)
        if(!show) throw new MissingReferenceError('Show', showID)
        return show
    }
}