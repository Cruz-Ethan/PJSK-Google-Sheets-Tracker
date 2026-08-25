import DatabaseHandler from "./DatabaseHandler.js"
import SkillTypeDatabase from "./SkillTypeDatabase.js"
import RarityDatabase from "./RarityDatabase.js"

class SkillEffect {
    static #skillEffects = []

    constructor(
        skillType,
        rarity,
        skillLevel,
        isTrained,
        isVirtualSinger,
        scoreBoost,
        perfectLockerMinimum,
        perfectLockerDuration,
        healthBoost
    ) {
        this.skillType = skillType
        this.rarity = rarity
        this.skillLevel = skillLevel
        this.isTrained = isTrained
        this.isVirtualSinger = isVirtualSinger
        this.scoreBoostPercentage = scoreBoost * 100
        this.perfectLockerMinimum = perfectLockerMinimum
        this.perfectLockerDuration = perfectLockerDuration
        this.healthBoost = healthBoost
        
        if(!SkillEffect.skillEffects) {
            SkillEffect.skillEffects = []
        }
        SkillEffect.skillEffects.push(this)
    }

    static getSkillEffects() {
        return SkillEffect.skillEffects
    }
}

export default class SkillEffectDatabase {
    static #instance
    static #sheetName = 'skill_effects'

    static #skillTypeDatabase
    static #rarityDatabase

    static async getInstance(googleSheetsID) {
        if(!SkillEffectDatabase.instance) {
            if(!SkillEffectDatabase.sheetName) {
                SkillEffectDatabase.sheetName = 'skill_effects'
            }
            if(!SkillEffectDatabase.skillTypeDatabase) {
                SkillEffectDatabase.skillTypeDatabase = await SkillTypeDatabase.getInstance(googleSheetsID)
            }
            if(!SkillEffectDatabase.rarityDatabase) {
                SkillEffectDatabase.rarityDatabase = await RarityDatabase.getInstance(googleSheetsID)
            }


            SkillEffectDatabase.instance = new SkillEffectDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SkillEffectDatabase.sheetName, false)
            rows.forEach(row => new SkillEffect(
                SkillEffectDatabase.skillTypeDatabase.getSkillType(row.c[0].v),
                SkillEffectDatabase.rarityDatabase.getRarity(row.c[1].v),
                row.c[2].v,
                row.c[3].v,
                row.c[4].v,
                row.c[5].v,
                row.c[6].v,
                row.c[7].v,
                row.c[8].v,
            ))
        }
        return SkillEffectDatabase.instance
    }

    getAllSkillEffects() {
        return [...SkillEffect.getSkillEffects()]
    }

    getSkillEffect(
        skillType,
        rarity,
        skillLevel,
        isTrained,
        isVirtualSinger
    ) {
        const skillEffects = this.getAllSkillEffects()
        return skillEffects.find(skillEffect =>
            skillEffect.skillType === skillType &&
            skillEffect.rarity === rarity &&
            skillEffect.skillLevel === skillLevel &&
            skillEffect.isTrained === isTrained &&
            skillEffect.isVirtualSinger === isVirtualSinger
        )
    }
}