import MissingReferenceError from "../../errors/MissingReferenceError.js"
import MissingValueError from "../../errors/MissingValueError.js"
import DatabaseHandler from "../generics/DatabaseHandler.js"

class Song {
    static #songs = []

    #song
    #imageUrl

    constructor(song, imageUrl) {
        if(!song) throw new MissingValueError('Song', 'song', song)
        if(!imageUrl) throw new MissingValueError('Song', 'imageUrl', song)

        this.#song = song
        this.#imageUrl = imageUrl
        
        if(!Song.#songs) {
            Song.#songs = []
        }
        Song.#songs.push(this)
    }

    static getSongs() {
        return Song.#songs
    }

    get song() { return this.#song }
    get imageUrl() { return this.#imageUrl }
    get name() { return this.#song }

    toString() {
        return this.#song
    }
}

export default class SongDatabase {
    static #instance
    static #sheetName = 'songs'

    static async getInstance(googleSheetsID) {
        if(!SongDatabase.#instance) {
            if(!SongDatabase.#sheetName) {
                SongDatabase.#sheetName = 'songs'
            }
            SongDatabase.#instance = new SongDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SongDatabase.#sheetName)
            rows.forEach(row => new Song(row.c[0].v, row.c[1].v))
        }
        return SongDatabase.#instance
    }

    getAllSongs() {
        return [...Song.getSongs()]
    }

    getSong(songName) {
        const songs = this.getAllSongs()
        const song = songs.find(song => song.song === songName)
        if(!song) throw new MissingReferenceError('Song', songName)
        return song
    }
}