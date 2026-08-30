import CardSnapshotDatabase from "../databases/snapshots/CardSnapshotDatabase.js"
import getSnapshot from "./snapshots.js"
import { getTalent } from "./cardInfo.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const cardSnapshotDatabase = await CardSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCardSnapshots = cardSnapshotDatabase.getAllCardSnapshots()

export default function getTalentBoost(snapshots, items, card, time=new Date()) {
    const latestSnapshots = getItems(items, card).map(item => getSnapshot(snapshots, item, time))
    const totalBoostPercentage = latestSnapshots.reduce((percentage, snapshot) => percentage + (snapshot ? snapshot.talentBoostPercentage : 0), 0)
    const cardTalent = getTalent(card, time)
    return Math.trunc(cardTalent * totalBoostPercentage / 100)
}

function getItems(items, card) {
    return items.filter(item => item.isApplicableTo(card))
}