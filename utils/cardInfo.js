import CardSnapshotDatabase from "../databases/CardSnapshotDatabase.js"
import SkillEffectDatabase from "../databases/SkillEffectDatabase.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const cardSnapshotDatabase = await CardSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCardSnapshots = cardSnapshotDatabase.getAllCardSnapshots()

const skillEffectDatabase = await SkillEffectDatabase.getInstance(pjskGoogleSheetsID)
const allSkillEffects = skillEffectDatabase.getAllSkillEffects()

export function getCurrentTalent(card) {
    const cardSnapshots = allCardSnapshots.filter(snapshot => snapshot.card === card)
    if(!cardSnapshots) return 0

    const latestSnapshot = cardSnapshots.reduce((prev, curr) => curr.time > prev.time ? curr : prev, cardSnapshots[0])
    return latestSnapshot.talent
}

export function getCurrentSnapshot(card) {
    const cardSnapshots = allCardSnapshots.filter(snapshot => snapshot.card === card)
    if(!cardSnapshots) return null
    return cardSnapshots.reduce((prev, curr) => curr.time > prev.time ? curr : prev, cardSnapshots[0])
}

export function getCurrentImageUrl(card) {
    const currentSnapshot = getCurrentSnapshot(card)
    return currentSnapshot.isTrained ? card.trainedUrl : card.untrainedUrl
}

export function getSkillEffect(card) {
    const currentSnapshot = getCurrentSnapshot(card)
    return skillEffectDatabase.getSkillEffect(card.skillType, card.rarity, currentSnapshot.skillLevel, currentSnapshot.isTrained, card.supportUnit === 'VIRTUAL SINGER')
}