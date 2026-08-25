import DatabaseHandler from "./DatabaseHandler.js"
import CharacterDatabase from "./CharacterDatabase.js"
import SupportUnitDatabase from "./SupportUnitDatabase.js"
import AttributeDatabase from "./AttributeDatabase.js"
import SkillTypeDatabase from "./SkillTypeDatabase.js"
import RarityDatabase from "./RarityDatabase.js"

class Card {
    static #cards = []

    constructor(
        card,
        character,
        supportUnit,
        attribute,
        skillType,
        rarity,
        untrainedUrl,
        trainedUrl
    ) {
        this.card = card
        this.character = character
        this.supportUnit = supportUnit
        this.attribute = attribute
        this.skillType = skillType
        this.rarity = rarity
        this.untrainedUrl = untrainedUrl
        this.trainedUrl = trainedUrl

        if(!Card.cards) {
            Card.cards = []
        }
        Card.cards.push(this)
    }

    static getCards() {
        return Card.cards
    }
}

export default class CardDatabase {
    static #instance
    static #sheetName = 'cards'

    static #characterDatabase
    static #supportUnitDatabase
    static #attributeDatabase
    static #skillTypeDatabase
    static #rarityDatabase

    static async getInstance(googleSheetsID) {
        if(!CardDatabase.instance) {
            if(!CardDatabase.sheetName) {
                CardDatabase.sheetName = 'cards'
            }
            if(!CardDatabase.characterDatabase) {
                CardDatabase.characterDatabase = await CharacterDatabase.getInstance(googleSheetsID)
            }
            if(!CardDatabase.supportUnitDatabase) {
                CardDatabase.supportUnitDatabase = await SupportUnitDatabase.getInstance(googleSheetsID)
            }
            if(!CardDatabase.attributeDatabase) {
                CardDatabase.attributeDatabase = await AttributeDatabase.getInstance(googleSheetsID)
            }
            if(!CardDatabase.skillTypeDatabase) {
                CardDatabase.skillTypeDatabase = await SkillTypeDatabase.getInstance(googleSheetsID)
            }
            if(!CardDatabase.rarityDatabase) {
                CardDatabase.rarityDatabase = await RarityDatabase.getInstance(googleSheetsID)
            }

            CardDatabase.instance = new CardDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CardDatabase.sheetName)
            rows.forEach(row => new Card(
                row.c[0].v,
                CardDatabase.characterDatabase.getCharacter(row.c[1].v),
                CardDatabase.supportUnitDatabase.getSupportUnit(row.c[2].v),
                CardDatabase.attributeDatabase.getAttribute(row.c[3].v),
                CardDatabase.skillTypeDatabase.getSkillType(row.c[4].v),
                CardDatabase.rarityDatabase.getRarity(row.c[5].v),
                row.c[6].v, row.c[7].v
            ))
        }
        return CardDatabase.instance
    }

    getAllCards() {
        return [...Card.getCards()]
    }

    getCard(cardName) {
        const cards = this.getAllCards()
        return cards.find(card => card.card === cardName)
    }
}