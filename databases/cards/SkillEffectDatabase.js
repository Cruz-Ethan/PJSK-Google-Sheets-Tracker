import DatabaseHandler from "../generics/DatabaseHandler.js"
import SkillTypeDatabase from "./SkillTypeDatabase.js"
import RarityDatabase from "./RarityDatabase.js"
import MissingReferenceError from "../../errors/MissingReferenceError.js"
import MissingValueError from "../../errors/MissingValueError.js"
import InvalidValueError from "../../errors/InvalidValueError.js"

class SkillEffect {
    static #skillEffects = []

    static #minSkillLevel = 1
    static #maxSkillLevel = 4

    #skillType
    #rarity
    #skillLevel
    #isTrained
    #isVirtualSinger
    #scoreBoostPercentage
    #perfectLockerMinimum
    #perfectLockerDurationSeconds
    #healthBoost

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
        if(!skillType) throw new MissingValueError('SkillEffect', 'skillType', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(!rarity) throw new MissingValueError('SkillEffect', 'rarity', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(!skillLevel) throw new MissingValueError('SkillEffect', 'skillLevel', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(typeof isTrained !== "boolean") throw new MissingValueError('SkillEffect', 'isTrained', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(typeof isVirtualSinger !== "boolean") throw new MissingValueError('SkillEffect', 'isVirtualSinger', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(!scoreBoost) throw new MissingValueError('SkillEffect', 'skillscoreBoostType', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(!perfectLockerMinimum) throw new MissingValueError('SkillEffect', 'perfectLockerMinimum', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(typeof perfectLockerDuration !== "number") throw new MissingValueError('SkillEffect', 'perfectLockerDuration', skillType, rarity, skillLevel, isTrained, isVirtualSinger)
        if(typeof healthBoost !== "number") throw new MissingValueError('SkillEffect', 'healthBoost', skillType, rarity, skillLevel, isTrained, isVirtualSinger)

        if(skillLevel < SkillEffect.#minSkillLevel || skillLevel > SkillEffect.#maxSkillLevel) {
            throw new InvalidValueError(
                'SkillEffect',
                'skillLevel',
                skillLevel,
                `Skill level must be between ${SkillEffect.#minSkillLevel} and ${SkillEffect.#maxSkillLevel}`,
                skillType, rarity, skillLevel, isTrained, isVirtualSinger
            )
        }

        if(rarity.rarity === '1 star' || rarity.rarity === 'birthday') {
            if(skillType.skillType !== 'scorer') {
                throw new InvalidValueError(
                    'SkillEffect',
                    'skillType',
                    skillType,
                    `${rarity} cards must be scorers.`,
                    skillType, rarity, skillLevel, isTrained, isVirtualSinger
                )
            }
        }

        if(skillType.skillType === 'life scorer' ||
            skillType.skillType === 'perfect scorer' ||
            skillType.skillType === 'combo scorer' ||
            skillType.skillType === 'unit scorer' ||
            skillType.skillType === 'bloom festival scorer'
        ) {
            if(rarity.rarity !== '4 star') {
                throw new InvalidValueError(
                    'SkillEffect',
                    'skillType',
                    skillType,
                    `Only 4 star cards have the skill type: ${skillType}.`,
                    skillType, rarity, skillLevel, isTrained, isVirtualSinger
                )
            }
        }

        if(scoreBoost < 0) {
            throw new InvalidValueError(
                'SkillEffect',
                'scoreBoost',
                scoreBoost,
                `Score boost cannot be negative.`,
                skillType, rarity, skillLevel, isTrained, isVirtualSinger
            )
        }

        if(perfectLockerDuration < 0) {
            throw new InvalidValueError(
                'SkillEffect',
                'perfectLockerDuration',
                perfectLockerDuration,
                `Perfect locker duration cannot be negative.`,
                skillType, rarity, skillLevel, isTrained, isVirtualSinger
            )
        }

        if(healthBoost < 0) {
            throw new InvalidValueError(
                'SkillEffect',
                'healthBoost',
                healthBoost,
                `Health boost cannot be negative.`,
                skillType, rarity, skillLevel, isTrained, isVirtualSinger
            )
        }

        if(perfectLockerMinimum !== 'perfect' &&
            perfectLockerMinimum !== 'great' &&
            perfectLockerMinimum !== 'good' &&
            perfectLockerMinimum !== 'bad'
        ) {
            throw new InvalidValueError(
                'SkillEffect',
                'perfectLockerMinimum',
                perfectLockerMinimum,
                `Perfect locker minimum must be perfect, great, good, or bad.`,
                skillType, rarity, skillLevel, isTrained, isVirtualSinger
            )
        }

        this.#skillType = skillType
        this.#rarity = rarity
        this.#skillLevel = skillLevel
        this.#isTrained = isTrained
        this.#isVirtualSinger = isVirtualSinger
        this.#scoreBoostPercentage = scoreBoost * 100
        this.#perfectLockerMinimum = perfectLockerMinimum
        this.#perfectLockerDurationSeconds = perfectLockerDuration
        this.#healthBoost = healthBoost
        
        if(!SkillEffect.#skillEffects) {
            SkillEffect.#skillEffects = []
        }
        SkillEffect.#skillEffects.push(this)
    }

    static getSkillEffects() {
        return SkillEffect.#skillEffects
    }

    get skillType() { return this.#skillType }
    get rarity() { return this.#rarity }
    get skillLevel() { return this.#skillLevel }
    get isTrained() { return this.#isTrained }
    get isVirtualSinger() { return this.#isVirtualSinger }
    get scoreBoostPercentage() { return this.#scoreBoostPercentage }
    get perfectLockerMinimum() { return this.#perfectLockerMinimum }
    get perfectLockerDurationSeconds() { return this.#perfectLockerDurationSeconds }
    get healthBoost() { return this.#healthBoost }

    toString() {
        return `${this.#rarity} level ${this.#skillLevel} ${this.#skillType}`
    }
}

export default class SkillEffectDatabase {
    static #instance
    static #sheetName = 'skill_effects'

    static #skillTypeDatabase
    static #rarityDatabase

    static async getInstance(googleSheetsID) {
        if(!SkillEffectDatabase.#instance) {
            if(!SkillEffectDatabase.#sheetName) {
                SkillEffectDatabase.#sheetName = 'skill_effects'
            }
            if(!SkillEffectDatabase.#skillTypeDatabase) {
                SkillEffectDatabase.#skillTypeDatabase = await SkillTypeDatabase.getInstance(googleSheetsID)
            }
            if(!SkillEffectDatabase.#rarityDatabase) {
                SkillEffectDatabase.#rarityDatabase = await RarityDatabase.getInstance(googleSheetsID)
            }


            SkillEffectDatabase.#instance = new SkillEffectDatabase()
            const database = DatabaseHandler.getDatabase(googleSheetsID)
            const rows = await database.getObjects(SkillEffectDatabase.#sheetName, false)
            rows.forEach(row => new SkillEffect(
                SkillEffectDatabase.#skillTypeDatabase.getSkillType(row.c[0].v),
                SkillEffectDatabase.#rarityDatabase.getRarity(row.c[1].v),
                row.c[2].v,
                row.c[3].v,
                row.c[4].v,
                row.c[5].v,
                row.c[6].v,
                row.c[7].v,
                row.c[8].v,
            ))
        }
        return SkillEffectDatabase.#instance
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
        const skillEffect = skillEffects.find(skillEffect =>
            skillEffect.skillType === skillType &&
            skillEffect.rarity === rarity &&
            skillEffect.skillLevel === skillLevel &&
            skillEffect.isTrained === isTrained &&
            skillEffect.isVirtualSinger === isVirtualSinger
        )
        if(!skillEffect) throw new MissingReferenceError(
            'SkillEffect', skillType, rarity, skillLevel, isTrained, isVirtualSinger
        )
        return skillEffect
    }
}