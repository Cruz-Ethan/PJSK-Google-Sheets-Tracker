import DatabaseHandler from "../generics/DatabaseHandler.js"
import AttributeDatabase from "../cards/AttributeDatabase.js"
import MissingReferenceError from "../../errors/MissingReferenceError.js"
import MissingValueError from "../../errors/MissingValueError.js"

class AttributeAreaItem {
    static #attributeAreaItems = []
    #attributeAreaItem
    #attribute

    constructor(attributeAreaItem, attribute) {
        if(!attributeAreaItem) throw new MissingValueError('AttributeAreaItem', 'attributeAreaItem', attributeAreaItem)
        if(!attribute) throw new MissingValueError('AttributeAreaItem', 'attribute', attributeAreaItem)

        this.#attributeAreaItem = attributeAreaItem
        this.#attribute = attribute

        if(!AttributeAreaItem.#attributeAreaItems) {
            AttributeAreaItem.#attributeAreaItems = []
        }
        AttributeAreaItem.#attributeAreaItems.push(this)
    }

    static getAttributeAreaItems() {
        return AttributeAreaItem.#attributeAreaItems
    }

    get attributeAreaItem() {
        return this.#attributeAreaItem
    }

    get attribute() {
        return this.#attribute
    }

    toString() {
        return this.#attributeAreaItem
    }

    isApplicableTo(card) {
        return this.#attribute === card.attribute
    }
}

export default class AttributeAreaItemDatabase {
    static #instance
    static #sheetName = 'attribute_area_items'

    static #attributeDatabase

    static async getInstance(googleSheetsID) {
        if(!AttributeAreaItemDatabase.#instance) {
            if(!AttributeAreaItemDatabase.#sheetName) {
                AttributeAreaItemDatabase.#sheetName = 'attribute_area_items'
            }
            if(!AttributeAreaItemDatabase.#attributeDatabase) {
                AttributeAreaItemDatabase.#attributeDatabase = await AttributeDatabase.getInstance(googleSheetsID)
            }

            AttributeAreaItemDatabase.#instance = new AttributeAreaItemDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(AttributeAreaItemDatabase.#sheetName)
            rows.forEach(row => new AttributeAreaItem(
                row.c[0].v,
                AttributeAreaItemDatabase.#attributeDatabase.getAttribute(row.c[1].v)
            ))
        }
        return AttributeAreaItemDatabase.#instance
    }

    getAllAttributeAreaItems() {
        return [...AttributeAreaItem.getAttributeAreaItems()]
    }

    getAttributeAreaItem(attributeAreaItemName) {
        const attributeAreaItems = this.getAllAttributeAreaItems()
        const attributeAreaItem = attributeAreaItems.find(attributeAreaItem => attributeAreaItem.attributeAreaItem === attributeAreaItemName)
        if(!attributeAreaItem) throw new MissingReferenceError('AttributeAreaItem', attributeAreaItemName)
        return attributeAreaItem
    }
}