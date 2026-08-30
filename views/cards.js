import CardDatabase from "../databases/cards/CardDatabase.js";
import CardSnapshotDatabase from "../databases/snapshots/CardSnapshotDatabase.js"
import getSnapshot from "../utils/snapshots.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const cardSnapshotDatabase = await CardSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCardSnapshots = cardSnapshotDatabase.getAllCardSnapshots()

const cardDatabase = await CardDatabase.getInstance(pjskGoogleSheetsID)
const allCards = cardDatabase.getAllCards()

const cardList = document.getElementById('cardList')

allCards.forEach(card => {
    const currentSnapshot = getSnapshot(allCardSnapshots, card)
    if(currentSnapshot === null) return

    cardList.innerHTML += `<li class="bg-white rounded shadow flex flex-col">
                    <div class="flex justify-center items-center p-5">
                        <img src="${currentSnapshot.isTrained ? card.trainedUrl : card.untrainedUrl}" alt="">
                    </div>
                    <div class="bg-emerald-200 text-center p-5 rounded-b flex-1">
                        <h2 class="text-xl font-semibold">${card.card}</h2>
                        <h3 class="text-lg text-gray-500">Talent: ${currentSnapshot.talent}</h3>
                    </div>
                </li>`
})