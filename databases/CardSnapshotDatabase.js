import DatabaseHandler from "./DatabaseHandler.js"
import CardDatabase from "./CardDatabase.js"
import MissingValueError from "../errors/MissingValueError.js"
import InvalidValueError from "../errors/InvalidValueError.js"
import { getDate } from "../utils/format.js"

class CardSnapshot {
    static #cardSnapshots = []
    #card
    #time
    #level
    #masteryRank
    #talent
    #skillLevel
    #isTrained

    constructor(
        card,
        timeString,
        level,
        masteryRank,
        talent,
        skillLevel,
        isTrained
    ) {
        if (!card) throw new MissingValueError('CardSnapshot', 'card', card, timeString)
        if (!timeString) throw new MissingValueError('CardSnapshot', 'timeString', card, timeString)
        if (!level) throw new MissingValueError('CardSnapshot', 'level', card, timeString)
        if (typeof masteryRank !== "number") throw new MissingValueError('CardSnapshot', 'masteryRank', card, timeString)
        if (!talent) throw new MissingValueError('CardSnapshot', 'talent', card, timeString)
        if (!skillLevel) throw new MissingValueError('CardSnapshot', 'skillLevel', card, timeString)
        if (typeof isTrained !== "boolean") throw new MissingValueError('CardSnapshot', 'isTrained', card, timeString)

        if (level < 0) throw new InvalidValueError(
            'CardSnapshot',
            'level',
            level,
            'Level must be positive.',
            card, timeString
        )

        if (masteryRank < 0) throw new InvalidValueError(
            'CardSnapshot',
            'masteryRank',
            masteryRank,
            'Mastery rank must be positive.',
            card, timeString
        )

        if (talent < 0) throw new InvalidValueError(
            'CardSnapshot',
            'talent',
            talent,
            'Talent must be positive.',
            card, timeString
        )

        if (skillLevel < 0) throw new InvalidValueError(
            'CardSnapshot',
            'skillLevel',
            skillLevel,
            'Skill level must be positive.',
            card, timeString
        )

        if(card.rarity.rarity === "4 star") {
            if(level > 60) throw new InvalidValueError(
                'CardSnapshot',
                'level',
                level,
                '4 star cards cannot be over level 60.'
            )
        
            if(isTrained && level < 50) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                '4 star cards cannot be trained if below level 50.',
                card, timeString
            )
            
            if(!isTrained && level > 50) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                '4 star cards must be trained if above level 50.',
                card, timeString
            )
        }
        else if(card.rarity.rarity === "birthday") {
            if(level > 60) throw new InvalidValueError(
                'CardSnapshot',
                'level',
                level,
                'Birthday cards cannot be over level 60.'
            )
        
            if(isTrained) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                'Birthday cards cannot be trained.',
                card, timeString
            )
        }
        else if(card.rarity.rarity === "3 star") {
            if(level > 50) throw new InvalidValueError(
                'CardSnapshot',
                'level',
                level,
                '3 star cards cannot be over level 50.'
            )
        
            if(isTrained && level < 40) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                '3 star cards cannot be trained if below level 40.',
                card, timeString
            )
            
            if(!isTrained && level > 40) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                '3 star cards must be trained if above level 40.',
                card, timeString
            )
        }
        else if(card.rarity.rarity === "2 star") {
            if(level > 30) throw new InvalidValueError(
                'CardSnapshot',
                'level',
                level,
                '2 star cards cannot be over level 30.'
            )
        
            if(isTrained) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                '2 star cards cannot be trained.',
                card, timeString
            )
        }
        else if(card.rarity.rarity === "1 star") {
            if(level > 20) throw new InvalidValueError(
                'CardSnapshot',
                'level',
                level,
                '1 star cards cannot be over level 60.'
            )
        
            if(isTrained) throw new InvalidValueError(
                'CardSnapshot',
                'isTrained',
                isTrained,
                '1 star cards cannot be trained.',
                card, timeString
            )
        }

        this.#card = card
        this.#time = getDate(timeString)
        this.#level = level
        this.#masteryRank = masteryRank
        this.#talent = talent
        this.#skillLevel = skillLevel
        this.#isTrained = isTrained

        if (!CardSnapshot.#cardSnapshots) {
            CardSnapshot.#cardSnapshots = []
        }
        CardSnapshot.#cardSnapshots.push(this)
    }

    static getCardSnapshots() {
        return CardSnapshot.#cardSnapshots
    }

    get card() { return this.#card }
    get time() { return this.#time }
    get level() { return this.#level }
    get masteryRank() { return this.#masteryRank }
    get talent() { return this.#talent }
    get skillLevel() { return this.#skillLevel }
    get isTrained() { return this.#isTrained }
}

export default class CardSnapshotDatabase {
    static #instance
    static #sheetName = 'card_snapshots'

    static #cardDatabase

    static async getInstance(googleSheetsID) {
        if (!CardSnapshotDatabase.#instance) {
            if (!CardSnapshotDatabase.#sheetName) {
                CardSnapshotDatabase.#sheetName = 'card_snapshots'
            }
            if (!CardSnapshotDatabase.#cardDatabase) {
                CardSnapshotDatabase.#cardDatabase = await CardDatabase.getInstance(googleSheetsID)
            }

            CardSnapshotDatabase.#instance = new CardSnapshotDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CardSnapshotDatabase.#sheetName, false)
            rows.forEach(row => new CardSnapshot(
                CardSnapshotDatabase.#cardDatabase.getCard(row.c[0].v),
                row.c[1].v,
                row.c[2].v,
                row.c[3].v,
                row.c[4].v,
                row.c[5].v,
                row.c[6].v,
            ))
        }
        return CardSnapshotDatabase.#instance
    }

    getAllCardSnapshots() {
        return [...CardSnapshot.getCardSnapshots()]
    }

    getCardSnapshots(card) {
        const cardSnapshots = this.getAllCardSnapshots()
        return cardSnapshots.filter(cardSnapshot => cardSnapshot.card === card)
    }
}