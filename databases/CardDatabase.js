import DatabaseHandler from "./DatabaseHandler.js"
import CharacterDatabase from "./CharacterDatabase.js"
import SupportUnitDatabase from "./SupportUnitDatabase.js"
import AttributeDatabase from "./AttributeDatabase.js"
import SkillTypeDatabase from "./SkillTypeDatabase.js"
import RarityDatabase from "./RarityDatabase.js"
import MissingValueError from "../errors/MissingValueError.js"
import MissingReferenceError from "../errors/MissingReferenceError.js"
import InvalidValueError from "../errors/InvalidValueError.js"

class Card {
    static #cards = []
    #card
    #character
    #supportUnit
    #attribute
    #skillType
    #rarity
    #untrainedUrl
    #trainedUrl

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
        if (!card) throw new MissingValueError('Card', 'card', card)
        if (!character) throw new MissingValueError('Card', 'character', card)
        if (!supportUnit) throw new MissingValueError('Card', 'supportUnit', card)
        if (!attribute) throw new MissingValueError('Card', 'attribute', card)
        if (!skillType) throw new MissingValueError('Card', 'skillType', card)
        if (!rarity) throw new MissingValueError('Card', 'rarity', card)
        if (!untrainedUrl) throw new MissingValueError('Card', 'untrainedUrl', card)
        if (!trainedUrl) throw new MissingValueError('Card', 'trainedUrl', card)

        if (character.supportUnit.supportUnit !== 'VIRTUAL SINGER' && character.supportUnit !== supportUnit) {
            throw new InvalidValueError(
                'Card',
                'supportUnit',
                supportUnit,
                'Non-VIRTUAL SINGER characters must match their specific support unit.',
                card
            )
        }

        if (rarity.rarity === '1 star' || rarity.rarity === 'birthday') {
            if (skillType.skillType !== 'scorer') {
                throw new InvalidValueError(
                    'CardDatabase',
                    'skillType',
                    skillType,
                    `${rarity} cards must be scorers.`,
                    card
                )
            }
        }

        if (skillType.skillType === 'life scorer' ||
            skillType.skillType === 'perfect scorer' ||
            skillType.skillType === 'combo scorer' ||
            skillType.skillType === 'unit scorer' ||
            skillType.skillType === 'bloom festival scorer'
        ) {
            if (rarity.rarity !== '4 star') {
                throw new InvalidValueError(
                    'CardDatabase',
                    'skillType',
                    skillType,
                    `Only 4 star cards have the skill type: ${skillType}.`,
                    card
                )
            }
        }

        this.#card = card
        this.#character = character
        this.#supportUnit = supportUnit
        this.#attribute = attribute
        this.#skillType = skillType
        this.#rarity = rarity
        this.#untrainedUrl = untrainedUrl
        this.#trainedUrl = trainedUrl

        if (!Card.#cards) {
            Card.#cards = []
        }
        Card.#cards.push(this)
    }

    static getCards() {
        return Card.#cards
    }

    get card() { return this.#card }
    get character() { return this.#character }
    get supportUnit() { return this.#supportUnit }
    get attribute() { return this.#attribute }
    get skillType() { return this.#skillType }
    get rarity() { return this.#rarity }
    get untrainedUrl() { return this.#untrainedUrl }
    get trainedUrl() { return this.#trainedUrl }
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
        if (!CardDatabase.#instance) {
            if (!CardDatabase.#sheetName) {
                CardDatabase.#sheetName = 'cards'
            }
            if (!CardDatabase.#characterDatabase) {
                CardDatabase.#characterDatabase = await CharacterDatabase.getInstance(googleSheetsID)
            }
            if (!CardDatabase.#supportUnitDatabase) {
                CardDatabase.#supportUnitDatabase = await SupportUnitDatabase.getInstance(googleSheetsID)
            }
            if (!CardDatabase.#attributeDatabase) {
                CardDatabase.#attributeDatabase = await AttributeDatabase.getInstance(googleSheetsID)
            }
            if (!CardDatabase.#skillTypeDatabase) {
                CardDatabase.#skillTypeDatabase = await SkillTypeDatabase.getInstance(googleSheetsID)
            }
            if (!CardDatabase.#rarityDatabase) {
                CardDatabase.#rarityDatabase = await RarityDatabase.getInstance(googleSheetsID)
            }

            CardDatabase.#instance = new CardDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(CardDatabase.#sheetName)
            rows.forEach(row => new Card(
                row.c[0].v,
                CardDatabase.#characterDatabase.getCharacter(row.c[1].v),
                CardDatabase.#supportUnitDatabase.getSupportUnit(row.c[2].v),
                CardDatabase.#attributeDatabase.getAttribute(row.c[3].v),
                CardDatabase.#skillTypeDatabase.getSkillType(row.c[4].v),
                CardDatabase.#rarityDatabase.getRarity(row.c[5].v),
                row.c[6].v, row.c[7].v
            ))
        }
        return CardDatabase.#instance
    }

    getAllCards() {
        return [...Card.getCards()]
    }

    getCard(cardName) {
        const cards = this.getAllCards()
        const card = cards.find(card => card.card === cardName)
        if (!card) throw new MissingReferenceError('Card', cardName)
        return card
    }
}