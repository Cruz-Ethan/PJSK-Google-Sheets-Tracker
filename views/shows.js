import ShowDatabase from "../databases/songs/ShowDatabase.js";
import SongDatabase from "../databases/songs/SongDatabase.js"
import DifficultyDatabase from "../databases/songs/DifficultyDatabase.js"
import ShowTypeDatabase from "../databases/songs/ShowTypeDatabase.js";
import TeamDatabase from "../databases/cards/TeamDatabase.js";
import { displayShow } from "../utils/display.js";
import addFunctionToFilter from "../utils/itemFilter.js";
import { getShowLength, getShowLevel } from "../utils/showInfo.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const showDatabase = await ShowDatabase.getInstance(pjskGoogleSheetsID)
const allShows = showDatabase.getAllShows()

const minLevel = document.getElementById('minLevel')
const maxLevel = document.getElementById('maxLevel')
const minNotes = document.getElementById('minNotes')
const maxNotes = document.getElementById('maxNotes')
const minNoteSpeed = document.getElementById('minNoteSpeed')
const maxNoteSpeed = document.getElementById('maxNoteSpeed')
const minTime = document.getElementById('minTime')
const maxTime = document.getElementById('maxTime')
const minScore = document.getElementById('minScore')
const maxScore = document.getElementById('maxScore')
const minInterruptions = document.getElementById('minInterruptions')
const maxInterruptions = document.getElementById('maxInterruptions')
const minAttempts = document.getElementById('minAttempts')
const maxAttempts = document.getElementById('maxAttempts')

maxTime.valueAsDate = new Date()

const minLongestCombo = document.getElementById('minLongestCombo')
const maxLongestCombo = document.getElementById('maxLongestCombo')
const minPerfectPercentage = document.getElementById('minPerfectPercentage')
const maxPerfectPercentage = document.getElementById('maxPerfectPercentage')
const minGreatPercentage = document.getElementById('minGreatPercentage')
const maxGreatPercentage = document.getElementById('maxGreatPercentage')
const minGoodPercentage = document.getElementById('minGoodPercentage')
const maxGoodPercentage = document.getElementById('maxGoodPercentage')
const minBadPercentage = document.getElementById('minBadPercentage')
const maxBadPercentage = document.getElementById('maxBadPercentage')
const minMissPercentage = document.getElementById('minMissPercentage')
const maxMissPercentage = document.getElementById('maxMissPercentage')
const songTitle = document.getElementById('songTitle')

minLevel.addEventListener('change', displayShows)
maxLevel.addEventListener('change', displayShows)
minNotes.addEventListener('change', displayShows)
maxNotes.addEventListener('change', displayShows)
songTitle.addEventListener('change', displayShows)

const difficultyDatabase = await DifficultyDatabase.getInstance(pjskGoogleSheetsID)
const allDifficulties = difficultyDatabase.getAllDifficulties()
const difficultySelectButton = document.getElementById('difficultySelectButton')
const difficultySelectList = document.getElementById('difficultySelectList')
const difficultyFilterList = [...allDifficulties]

const showTypeDatabase = await ShowTypeDatabase.getInstance(pjskGoogleSheetsID)
const allShowTypes = showTypeDatabase.getAllShowTypes()
const showTypeSelectButton = document.getElementById('showTypeSelectButton')
const showTypeSelectList = document.getElementById('showTypeSelectList')
const showTypeFilterList = [...allShowTypes]

const teamDatabase = await TeamDatabase.getInstance(pjskGoogleSheetsID)
const allTeams = teamDatabase.getAllTeams()
const teamSelectButton = document.getElementById('teamSelectButton')
const teamSelectList = document.getElementById('teamSelectList')
const teamFilterList = [...allTeams]

const DScoreObj = {name: 'D'}
const CScoreObj = {name: 'C'}
const BScoreObj = {name: 'B'}
const AScoreObj = {name: 'A'}
const SScoreObj = {name: 'S'}
const scoreOptions = [SScoreObj, AScoreObj, BScoreObj, CScoreObj, DScoreObj]
const rankSelectButton = document.getElementById('rankSelectButton')
const rankSelectList = document.getElementById('rankSelectList')
const rankFilterList = [...scoreOptions]

const failedObj = {name: 'Failed'}
const clearedObj = {name: 'Cleared'}
const fullComboObj = {name: 'Full Combo'}
const allPerfectObj = {name: 'All Perfect'}
const clearStatusOptions = [failedObj, clearedObj, fullComboObj, allPerfectObj]
const clearStatusSelectButton = document.getElementById('clearStatusSelectButton')
const clearStatusSelectList = document.getElementById('clearStatusSelectList')
const clearStatusFilterList = [...clearStatusOptions]

addFunctionToFilter(difficultySelectButton, difficultySelectList, difficultyFilterList, [...allDifficulties], displayShows)
addFunctionToFilter(showTypeSelectButton, showTypeSelectList, showTypeFilterList, [...allShowTypes], displayShows)
addFunctionToFilter(teamSelectButton, teamSelectList, teamFilterList, [...allTeams], displayShows)
addFunctionToFilter(rankSelectButton, rankSelectList, rankFilterList, [...scoreOptions], displayShows)
addFunctionToFilter(clearStatusSelectButton, clearStatusSelectList, clearStatusFilterList, [...clearStatusOptions], displayShows)

const showsTable = document.getElementById('showsTable')

displayShows()

function displayShows() {
    showsTable.innerHTML = ''
    allShows.sort((a, b) => b.time - a.time)
    allShows.forEach(show => {
        if(!isFilterPassing(show)) {
            return false
        }
        displayShow(showsTable, show)
    })
}

function isFilterPassing(show) {
    if(!difficultyFilterList.includes(show.difficulty)) {
        return false
    }
    if(!showTypeFilterList.includes(show.showType)) {
        return false
    }
    if(!teamFilterList.includes(show.team)) {
        return false
    }

    if(show.rank.toLowerCase() === 's') {
        if(!rankFilterList.includes(SScoreObj)) {
            return false
        }
    }
    else if(show.rank.toLowerCase() === 'a') {
        if(!rankFilterList.includes(AScoreObj)) {
            return false
        }
    }
    else if(show.rank.toLowerCase() === 'b') {
        if(!rankFilterList.includes(BScoreObj)) {
            return false
        }
    }
    else if(show.rank.toLowerCase() === 'c') {
        if(!rankFilterList.includes(CScoreObj)) {
            return false
        }
    }
    else if(show.rank.toLowerCase() === 'd') {
        if(!rankFilterList.includes(DScoreObj)) {
            return false
        }
    }

    const songLevel = getShowLevel(show)
    const songLength = getShowLength(show)

    if(show.perfects === songLength) {
        if(!clearStatusFilterList.includes(allPerfectObj)) {
            return false
        }
    }
    else if(show.perfects + show.greats === songLength) {
        if(!clearStatusFilterList.includes(fullComboObj)) {
            return false
        }
    }
    else if(show.failed) {
        if(!clearStatusFilterList.includes(failedObj)) {
            return false
        }
    }
    else if(!clearStatusFilterList.includes(clearedObj)) {
        return false
    }

    if(songLevel < minLevel.value || songLevel > maxLevel.value) {
        return false
    }
    if(songLength < minNotes.value || songLength > maxNotes.value) {
        return false
    }
    if(show.noteSpeed < minNoteSpeed.value || show.noteSpeed > maxNoteSpeed.value) {
        return false
    }
    if(show.time < minTime.value || show.time > maxTime.value) {
        return false
    }
    if(show.score < minScore.value || show.score > maxScore.value) {
        return false
    }
    if(show.interruptions < minInterruptions.value || show.interruptions > maxInterruptions.value) {
        return false
    }
    if(show.attempts < minAttempts.value || show.attempts > maxAttempts.value) {
        return false
    }
    if(show.longestCombo < minLongestCombo.value || show.longestCombo > maxLongestCombo.value) {
        return false
    }

    const perfectPercentage = 100 * show.perfects / songLength
    if(perfectPercentage < minPerfectPercentage.value || perfectPercentage > maxPerfectPercentage.value) {
        return false
    }

    const greatPercentage = 100 * show.greats / songLength
    if(greatPercentage < minGreatPercentage.value || greatPercentage > maxGreatPercentage.value) {
        return false
    }

    const goodPercentage = 100 * show.goods / songLength
    if(goodPercentage < minGoodPercentage.value || goodPercentage > maxGoodPercentage.value) {
        return false
    }

    const badPercentage = 100 * show.bads / songLength
    if(badPercentage < minBadPercentage.value || badPercentage > maxBadPercentage.value) {
        return false
    }

    const missPercentage = 100 * show.misses / songLength
    if(missPercentage < minMissPercentage.value || missPercentage > maxMissPercentage.value) {
        return false
    }

    if(!show.song.name.toLowerCase().includes(songTitle.value.toLowerCase())) {
        return false
    }
    return true
}