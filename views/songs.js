import SongDatabase from "../databases/songs/SongDatabase.js"
import DifficultyDatabase from "../databases/songs/DifficultyDatabase.js"
import addFunctionToFilter from "../utils/itemFilter.js"
import { hasAppend } from "../utils/songInfo.js"
import { getSongCharts, getTimesPlayed } from "../utils/songInfo.js"
import { getChartLength, getChartLevel } from "../utils/chartInfo.js"
import { formatSongTitle } from "../utils/format.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const songDatabase = await SongDatabase.getInstance(pjskGoogleSheetsID)
const allSongs = songDatabase.getAllSongs()

const minLevel = document.getElementById('minLevel')
const maxLevel = document.getElementById('maxLevel')
const minNotes = document.getElementById('minNotes')
const maxNotes = document.getElementById('maxNotes')
const minTimesPlayed = document.getElementById('minTimesPlayed')
const maxTimesPlayed = document.getElementById('maxTimesPlayed')
const songTitle = document.getElementById('songTitle')

minLevel.addEventListener('change', displaySongs)
maxLevel.addEventListener('change', displaySongs)
minNotes.addEventListener('change', displaySongs)
maxNotes.addEventListener('change', displaySongs)
minTimesPlayed.addEventListener('change', displaySongs)
maxTimesPlayed.addEventListener('change', displaySongs)
songTitle.addEventListener('change', displaySongs)

const difficultyDatabase = await DifficultyDatabase.getInstance(pjskGoogleSheetsID)
const allDifficulties = difficultyDatabase.getAllDifficulties()
const difficultySelectButton = document.getElementById('difficultySelectButton')
const difficultySelectList = document.getElementById('difficultySelectList')
const difficultyFilterList = [...allDifficulties]

const noAppendObj = {name: 'No Append'}
const appendObj = {name: 'Append'}
const appendOptions = [noAppendObj, appendObj]
const appendSelectButton = document.getElementById('appendSelectButton')
const appendSelectList = document.getElementById('appendSelectList')
const appendFilterList = [...appendOptions]

addFunctionToFilter(difficultySelectButton, difficultySelectList, difficultyFilterList, [...allDifficulties], displaySongs)
addFunctionToFilter(appendSelectButton, appendSelectList, appendFilterList, [...appendOptions], displaySongs)

const songsList = document.getElementById('songsList')

displaySongs()

function displaySongs() {
    songsList.innerHTML = ''
    allSongs.forEach(song => {
        if(!isFilterPassing(song)) {
            return
        }
        displaySong(song)
    })
}

function displaySong(song) {
    const songCharts = getSongCharts(song)
    const easyChart = songCharts.find(chart => chart.difficulty === difficultyDatabase.getDifficulty('easy'))
    const normalChart = songCharts.find(chart => chart.difficulty === difficultyDatabase.getDifficulty('normal'))
    const hardChart = songCharts.find(chart => chart.difficulty === difficultyDatabase.getDifficulty('hard'))
    const expertChart = songCharts.find(chart => chart.difficulty === difficultyDatabase.getDifficulty('expert'))
    const masterChart = songCharts.find(chart => chart.difficulty === difficultyDatabase.getDifficulty('master'))
    const appendChart = songCharts.find(chart => chart.difficulty === difficultyDatabase.getDifficulty('append'))

    const timesPlayed = getTimesPlayed(song)

    songsList.innerHTML += `<li class="flex flex-col lg:flex-row justify-between gap-8 bg-white shadow rounded-md p-5">
        <div class="flex flex-col md:flex-row items-center gap-4">
            <img class="rounded-full w-20 h-20"
                src="${song.imageUrl}"
                alt="">
            <div>
                <div class="text-center md:text-start">${formatSongTitle(song)}</div>
                <div class="text-center md:text-start font-normal text-gray-500">Played ${timesPlayed} time${timesPlayed === 1 ? '' : 's'}</div>
            </div>
        </div>
        <div class="flex flex-col md:flex-row flex-1 items-stretch md:items-center justify-end gap-4">
            ${easyChart ? '<div class="flex-1 text-center rounded bg-green-400 text-white">' + easyChart.level + ' / ' + easyChart.length + '</div>' : ''}
            ${normalChart ? '<div class="flex-1 text-center rounded bg-blue-400 text-white">' + normalChart.level + ' / ' + normalChart.length + '</div>' : ''}
            ${hardChart ? '<div class="flex-1 text-center rounded bg-yellow-400 text-white">' + hardChart.level + ' / ' + hardChart.length + '</div>' : ''}
            ${expertChart ? '<div class="flex-1 text-center rounded bg-red-400 text-white">' + expertChart.level + ' / ' + expertChart.length + '</div>' : ''}
            ${masterChart ? '<div class="flex-1 text-center rounded bg-purple-400 text-white">' + masterChart.level + ' / ' + masterChart.length + '</div>' : ''}
            ${appendChart ? '<div class="flex-1 text-center rounded bg-fuchsia-400 text-white">' + appendChart.level + ' / ' + appendChart.length + '</div>' : ''}
        </div>
    </li>`
}

function isFilterPassing(song) {
    const songHasAppend = hasAppend(song)
    if(!appendFilterList.includes(appendObj) && songHasAppend) {
        return false
    }
    if(!appendFilterList.includes(noAppendObj) && !songHasAppend) {
        return false
    }

    const timesPlayed = getTimesPlayed(song)
    if(timesPlayed < minTimesPlayed.value || timesPlayed > maxTimesPlayed.value) {
        return false
    }

    if(!song.name.toLowerCase().includes(songTitle.value.toLowerCase())) {
        return false
    }

    let isFilterPassing = false
    allDifficulties.forEach(difficulty => {
        if(!difficultyFilterList.includes(difficulty)) {
            return
        }
        if(!songHasAppend && difficulty.name === 'append') {
            return
        }

        const chartLevel = getChartLevel(song, difficulty)
        if(chartLevel < minLevel.value || chartLevel > maxLevel.value) {
            return
        }

        const chartLength = getChartLength(song, difficulty)
        if(chartLength < minNotes.value || chartLength > maxNotes.value) {
            return
        }

        isFilterPassing = true
    })

    return isFilterPassing
}