import CharacterSnapshotDatabase from "../databases/CharacterSnapshotDatabase.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const characterSnapshotDatabase = await CharacterSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCharacterSnapshots = characterSnapshotDatabase.getAllCharacterSnapshots()

export function getRank(character, time=new Date()) {
    const characterSnapshots = allCharacterSnapshots.filter(snapshot => snapshot.character === character && snapshot.time < time)
    if(!characterSnapshots) return 1

    const latestSnapshot = characterSnapshots.reduce((prev, curr) => curr.time > prev.time ? curr : prev, characterSnapshots[0])
    return latestSnapshot.rank
}