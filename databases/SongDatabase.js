import DatabaseHandler from "./DatabaseHandler.js"

class Song {
    static #songs = []

    #song
    #imageUrl

    constructor(song, imageUrl) {
        this.#song = song
        this.#imageUrl = imageUrl
        
        if(!Song.songs) {
            Song.songs = []
        }
        Song.songs.push(this)
    }

    static getSongs() {
        return Song.songs
    }

    get song() { return this.#song }
    get imageUrl() { return this.#imageUrl }
}

export default class SongDatabase {
    static #instance
    static #sheetName = 'songs'

    static async getInstance(googleSheetsID) {
        if(!SongDatabase.instance) {
            if(!SongDatabase.sheetName) {
                SongDatabase.sheetName = 'songs'
            }
            SongDatabase.instance = new SongDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SongDatabase.sheetName)
            rows.forEach(row => new Song(row.c[0].v, row.c[1].v))
        }
        return SongDatabase.instance
    }

    getAllSongs() {
        return [...Song.getSongs()]
    }

    getSong(songName) {
        const songs = this.getAllSongs()
        return songs.find(song => song.song === songName)
    }
}