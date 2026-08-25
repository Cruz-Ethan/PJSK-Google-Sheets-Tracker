import DatabaseHandler from "./DatabaseHandler.js"
import AttributeDatabase from "./AttributeDatabase.js"

class AttributeAreaItem {
    static #attributeAreaItems = []

    constructor(attributeAreaItem, attribute) {
        this.attributeAreaItem = attributeAreaItem
        this.attribute = attribute

        if(!AttributeAreaItem.attributeAreaItems) {
            AttributeAreaItem.attributeAreaItems = []
        }
        AttributeAreaItem.attributeAreaItems.push(this)
    }

    static getAttributeAreaItems() {
        return AttributeAreaItem.attributeAreaItems
    }
}

export default class AttributeAreaItemDatabase {
    static #instance
    static #sheetName = 'attribute_area_items'

    static #attributeDatabase

    static async getInstance(googleSheetsID) {
        if(!AttributeAreaItemDatabase.instance) {
            if(!AttributeAreaItemDatabase.sheetName) {
                AttributeAreaItemDatabase.sheetName = 'attribute_area_items'
            }
            if(!AttributeAreaItemDatabase.attributeDatabase) {
                AttributeAreaItemDatabase.attributeDatabase = await AttributeDatabase.getInstance(googleSheetsID)
            }

            AttributeAreaItemDatabase.instance = new AttributeAreaItemDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(AttributeAreaItemDatabase.sheetName)
            rows.forEach(row => new AttributeAreaItem(
                row.c[0].v,
                AttributeAreaItemDatabase.attributeDatabase.getAttribute(row.c[1].v)
            ))
        }
        return AttributeAreaItemDatabase.instance
    }

    getAllAttributeAreaItems() {
        return [...AttributeAreaItem.getAttributeAreaItems()]
    }

    getAttributeAreaItem(attributeAreaItemName) {
        const attributeAreaItems = this.getAllAttributeAreaItems()
        return attributeAreaItems.find(attributeAreaItem => attributeAreaItem.attributeAreaItem === attributeAreaItemName)
    }
}