import CardSnapshotDatabase from "../databases/CardSnapshotDatabase.js"
import SkillEffectDatabase from "../databases/SkillEffectDatabase.js"
import getSnapshot from "./snapshots.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const cardSnapshotDatabase = await CardSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCardSnapshots = cardSnapshotDatabase.getAllCardSnapshots()

const skillEffectDatabase = await SkillEffectDatabase.getInstance(pjskGoogleSheetsID)
const allSkillEffects = skillEffectDatabase.getAllSkillEffects()

export function getTalent(card, time=new Date()) {
    const currentSnapshot = getSnapshot(allCardSnapshots, card, time)
    return currentSnapshot.talent
}

export function getImageUrl(card, time=new Date()) {
    const currentSnapshot = getSnapshot(allCardSnapshots, card, time)
    return currentSnapshot.isTrained ? card.trainedUrl : card.untrainedUrl
}

export function getSkillEffect(card, time=new Date()) {
    const currentSnapshot = getSnapshot(allCardSnapshots, card, time)
    return skillEffectDatabase.getSkillEffect(card.skillType, card.rarity, currentSnapshot.skillLevel, currentSnapshot.isTrained, card.supportUnit === 'VIRTUAL SINGER')
}

export function getHealthBoost(card, time=new Date()) {
    const skillEffect = getSkillEffect(card, time)
    return skillEffect.healthBoost
}

export function getScoreBoostPercentage(card, time=new Date()) {
    const skillEffect = getSkillEffect(card, time)
    return skillEffect.scoreBoostPercentage
}