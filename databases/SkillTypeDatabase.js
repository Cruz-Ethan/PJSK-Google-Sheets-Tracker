import DatabaseHandler from "./DatabaseHandler.js"

class SkillType {
    static #skillTypes = []

    #skillType

    constructor(skillType) {
        this.#skillType = skillType
        if(!SkillType.skillTypes) {
            SkillType.skillTypes = []
        }
        SkillType.skillTypes.push(this)
    }

    static getSkillTypes() {
        return SkillType.skillTypes
    }

    get skillType() { return this.#skillType }
}

export default class SkillTypeDatabase {
    static #instance
    static #sheetName = 'skill_types'

    static async getInstance(googleSheetsID) {
        if(!SkillTypeDatabase.instance) {
            if(!SkillTypeDatabase.sheetName) {
                SkillTypeDatabase.sheetName = 'skill_types'
            }
            SkillTypeDatabase.instance = new SkillTypeDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SkillTypeDatabase.sheetName)
            rows.forEach(row => new SkillType(row.c[0].v))
        }
        return SkillTypeDatabase.instance
    }

    getAllSkillTypes() {
        return [...SkillType.getSkillTypes()]
    }

    getSkillType(skillTypeName) {
        const skillTypes = this.getAllSkillTypes()
        return skillTypes.find(skillType => skillType.skillType === skillTypeName)
    }
}