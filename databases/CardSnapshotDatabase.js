import DatabaseHandler from "./DatabaseHandler.js"
import CardDatabase from "./CardDatabase.js"
import { getDate } from "../utils/format.js"

class CardSnapshot {
    static #cardSnapshots = []

    constructor(
        card,
        timeString,
        level,
        masteryRank,
        talent,
        skillLevel,
        isTrained
    ) {
        this.card = card
        this.time = getDate(timeString)
        this.level = level
        this.masteryRank = masteryRank
        this.talent = talent
        this.skillLevel = skillLevel
        this.isTrained = isTrained

        if(!CardSnapshot.cardSnapshots) {
            CardSnapshot.cardSnapshots = []
        }
        CardSnapshot.cardSnapshots.push(this)
    }

    static getCardSnapshots() {
        return CardSnapshot.cardSnapshots
    }
}

export default class CardSnapshotDatabase {
    static #instance
    static #sheetName = 'card_snapshots'

    static #cardDatabase

    static async getInstance(googleSheetsID) {
        if(!CardSnapshotDatabase.instance) {
            if(!CardSnapshotDatabase.sheetName) {
                CardSnapshotDatabase.sheetName = 'card_snapshots'
            }
            if(!CardSnapshotDatabase.cardDatabase) {
                CardSnapshotDatabase.cardDatabase = await CardDatabase.getInstance(googleSheetsID)
            }

            CardSnapshotDatabase.instance = new CardSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CardSnapshotDatabase.sheetName, false)
            rows.forEach(row => new CardSnapshot(
                CardSnapshotDatabase.cardDatabase.getCard(row.c[0].v),
                row.c[1].v,
                row.c[2].v,
                row.c[3].v,
                row.c[4].v,
                row.c[5].v,
                row.c[6].v,
            ))
        }
        return CardSnapshotDatabase.instance
    }

    getAllCardSnapshots() {
        return [...CardSnapshot.getCardSnapshots()]
    }

    getCardSnapshots(card) {
        const cardSnapshots = this.getAllCardSnapshots()
        return cardSnapshots.filter(cardSnapshot => cardSnapshot.card === card)
    }
}