import CharacterSnapshotDatabase from "../databases/snapshots/CharacterSnapshotDatabase.js";
import getSnapshot from "./snapshots.js";
import { getTalent } from "./cardInfo.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const characterSnapshotDatabase = await CharacterSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCharacterSnapshots = characterSnapshotDatabase.getAllCharacterSnapshots()

export function getRank(character, time=new Date()) {
    const characterSnapshot = getSnapshot(allCharacterSnapshots, character, time)
    if(!characterSnapshot) return 1
    return characterSnapshot.rank
}

export function getRankTalentBoost(card, time) {
    return Math.trunc(getTalent(card, time) * getRank(card.character, time) / 1000)
}