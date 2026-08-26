import DatabaseHandler from "./DatabaseHandler.js"

class Attribute {
    static #attributes = []
    #attribute

    constructor(attribute) {
        this.#attribute = attribute
        if(!Attribute.attributes) {
            Attribute.attributes = []
        }
        Attribute.attributes.push(this)
    }

    static getAttributes() {
        return Attribute.attributes
    }

    get attribute() {
        return this.#attribute
    }
}

export default class AttributeDatabase {
    static #instance
    static #sheetName = 'attributes'

    static async getInstance(googleSheetsID) {
        if(!AttributeDatabase.instance) {
            if(!AttributeDatabase.sheetName) {
                AttributeDatabase.sheetName = 'attributes'
            }
            AttributeDatabase.instance = new AttributeDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(AttributeDatabase.sheetName)
            rows.forEach(row => new Attribute(row.c[0].v))
        }
        return AttributeDatabase.instance
    }

    getAllAttributes() {
        return [...Attribute.getAttributes()]
    }

    getAttribute(attributeName) {
        const attributes = this.getAllAttributes()
        return attributes.find(attribute => attribute.attribute === attributeName)
    }
}