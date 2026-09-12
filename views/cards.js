import CardDatabase from "../databases/cards/CardDatabase.js";
import CardSnapshotDatabase from "../databases/snapshots/CardSnapshotDatabase.js"
import CharacterDatabase from "../databases/cards/CharacterDatabase.js";
import AttributeDatabase from "../databases/cards/AttributeDatabase.js";
import RarityDatabase from "../databases/cards/RarityDatabase.js";
import SupportUnitDatabase from "../databases/cards/SupportUnitDatabase.js";
import SkillTypeDatabase from "../databases/cards/SkillTypeDatabase.js";
import addFunctionToFilter from "../utils/itemFilter.js";
import { getScoreBoostPercentage, getHealthBoost } from "../utils/cardInfo.js";
import getSnapshot from "../utils/snapshots.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const cardSnapshotDatabase = await CardSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCardSnapshots = cardSnapshotDatabase.getAllCardSnapshots()

const cardDatabase = await CardDatabase.getInstance(pjskGoogleSheetsID)
const allCards = cardDatabase.getAllCards()

const cardList = document.getElementById('cardList')

const characterDatabase = await CharacterDatabase.getInstance(pjskGoogleSheetsID)
const allCharacters = characterDatabase.getAllCharacters()
const characterSelectButton = document.getElementById('characterSelectButton')
const characterSelectList = document.getElementById('characterSelectList')
const characterFilterList = [...allCharacters]

const attributeDatabase = await AttributeDatabase.getInstance(pjskGoogleSheetsID)
const allAttributes = attributeDatabase.getAllAttributes()
const attributeSelectButton = document.getElementById('attributeSelectButton')
const attributeSelectList = document.getElementById('attributeSelectList')
const attributeFilterList = [...allAttributes]

const rarityDatabase = await RarityDatabase.getInstance(pjskGoogleSheetsID)
const allRarities = rarityDatabase.getAllRarities()
const raritySelectButton = document.getElementById('raritySelectButton')
const raritySelectList = document.getElementById('raritySelectList')
const rarityFilterList = [...allRarities]

const supportUnitDatabase = await SupportUnitDatabase.getInstance(pjskGoogleSheetsID)
const allSupportUnits = supportUnitDatabase.getAllSupportUnits()
const supportUnitSelectButton = document.getElementById('supportUnitSelectButton')
const supportUnitSelectList = document.getElementById('supportUnitSelectList')
const supportUnitFilterList = [...allSupportUnits]

const skillTypeDatabase = await SkillTypeDatabase.getInstance(pjskGoogleSheetsID)
const allSkillTypes = skillTypeDatabase.getAllSkillTypes()
const skillTypeSelectButton = document.getElementById('skillTypeSelectButton')
const skillTypeSelectList = document.getElementById('skillTypeSelectList')
const skillTypeFilterList = [...allSkillTypes]

const trainedSelectButton = document.getElementById('trainedSelectButton')
const trainedSelectList = document.getElementById('trainedSelectList')
const trainedObj = {name: 'trained'}
const untrainedObj = {name: 'untrained'}
const trainedFilterList = [trainedObj, untrainedObj]

const minLevel = document.getElementById('minLevel')
const maxLevel = document.getElementById('maxLevel')
const minTalent = document.getElementById('minTalent')
const maxTalent = document.getElementById('maxTalent')
const minSkillLevel = document.getElementById('minSkillLevel')
const maxSkillLevel = document.getElementById('maxSkillLevel')
const minRank = document.getElementById('minRank')
const maxRank = document.getElementById('maxRank')
const minScoreBoost = document.getElementById('minScoreBoost')
const maxScoreBoost = document.getElementById('maxScoreBoost')
const minHealthBoost = document.getElementById('minHealthBoost')
const maxHealthBoost = document.getElementById('maxHealthBoost')

addFunctionToFilter(characterSelectButton, characterSelectList, characterFilterList, [...allCharacters], renderCardList)
addFunctionToFilter(attributeSelectButton, attributeSelectList, attributeFilterList, [...allAttributes], renderCardList)
addFunctionToFilter(raritySelectButton, raritySelectList, rarityFilterList, [...allRarities], renderCardList)
addFunctionToFilter(supportUnitSelectButton, supportUnitSelectList, supportUnitFilterList, [...allSupportUnits], renderCardList)
addFunctionToFilter(skillTypeSelectButton, skillTypeSelectList, skillTypeFilterList, [...allSkillTypes], renderCardList)
addFunctionToFilter(trainedSelectButton, trainedSelectList, trainedFilterList, [...trainedFilterList], renderCardList)

minLevel.addEventListener('change', renderCardList)
maxLevel.addEventListener('change', renderCardList)
minTalent.addEventListener('change', renderCardList)
maxTalent.addEventListener('change', renderCardList)
minSkillLevel.addEventListener('change', renderCardList)
maxSkillLevel.addEventListener('change', renderCardList)
minRank.addEventListener('change', renderCardList)
maxRank.addEventListener('change', renderCardList)
minScoreBoost.addEventListener('change', renderCardList)
maxScoreBoost.addEventListener('change', renderCardList)
minHealthBoost.addEventListener('change', renderCardList)
maxHealthBoost.addEventListener('change', renderCardList)

renderCardList()

function renderCardList() {
    cardList.innerHTML = ''
    allCards.forEach(card => {
        const currentSnapshot = getSnapshot(allCardSnapshots, card)
        if (!isFilterPassing(currentSnapshot)) return

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
}

function isFilterPassing(snapshot) {
    if (snapshot === null) {
        return false
    }
    if (!characterFilterList.includes(snapshot.card.character)) {
        return false
    }
    if(!attributeFilterList.includes(snapshot.card.attribute)) {
        return false
    }
    if(!rarityFilterList.includes(snapshot.card.rarity)) {
        return false
    }
    if(!supportUnitFilterList.includes(snapshot.card.supportUnit)) {
        return false
    }
    if(!skillTypeFilterList.includes(snapshot.card.skillType)) {
        return false
    }
    if(!trainedFilterList.includes(trainedObj) && snapshot.isTrained) {
        return false
    }
    if(!trainedFilterList.includes(untrainedObj) && !snapshot.isTrained) {
        return false
    }
    if(snapshot.level < minLevel.value) {
        return false
    }
    if(snapshot.level > maxLevel.value) {
        return false
    }
    if(snapshot.talent < minTalent.value) {
        return false
    }
    if(snapshot.talent > maxTalent.value) {
        return false
    }
    if(snapshot.skillLevel < minSkillLevel.value) {
        return false
    }
    if(snapshot.skillLevel > maxSkillLevel.value) {
        return false
    }
    if(snapshot.skillLevel < minSkillLevel.value) {
        return false
    }
    if(snapshot.skillLevel > maxSkillLevel.value) {
        return false
    }
    if(snapshot.masteryRank < minRank.value) {
        return false
    }
    if(snapshot.masteryRank > maxRank.value) {
        return false
    }
    if(getScoreBoostPercentage(snapshot.card) < minScoreBoost.value) {
        return false
    }
    if(getScoreBoostPercentage(snapshot.card) > maxScoreBoost.value) {
        return false
    }
    if(getHealthBoost(snapshot.card) < minHealthBoost.value) {
        return false
    }
    if(getHealthBoost(snapshot.card) > maxHealthBoost.value) {
        return false
    }
    return true
}