import CardSnapshotDatabase from "../databases/CardSnapshotDatabase.js"
import SkillEffectDatabase from "../databases/SkillEffectDatabase.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const cardSnapshotDatabase = await CardSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCardSnapshots = cardSnapshotDatabase.getAllCardSnapshots()

const skillEffectDatabase = await SkillEffectDatabase.getInstance(pjskGoogleSheetsID)
const allSkillEffects = skillEffectDatabase.getAllSkillEffects()

export function getSnapshot(card, time=new Date()) {
    const cardSnapshots = allCardSnapshots.filter(snapshot => snapshot.card === card && snapshot.time < time)
    if(!cardSnapshots) return null
    return cardSnapshots.reduce((prev, curr) => curr.time > prev.time ? curr : prev, cardSnapshots[0])
}

export function getTalent(card, time=new Date()) {
    const currentSnapshot = getSnapshot(card, time)
    return currentSnapshot.talent
}

export function getImageUrl(card, time=new Date()) {
    const currentSnapshot = getSnapshot(card, time)
    return currentSnapshot.isTrained ? card.trainedUrl : card.untrainedUrl
}

export function getSkillEffect(card, time=new Date()) {
    const currentSnapshot = getSnapshot(card, time)
    return skillEffectDatabase.getSkillEffect(card.skillType, card.rarity, currentSnapshot.skillLevel, currentSnapshot.isTrained, card.supportUnit === 'VIRTUAL SINGER')
}