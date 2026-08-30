import SongDatabase from "../databases/songs/SongDatabase.js"
import DifficultyDatabase from "../databases/songs/DifficultyDatabase.js"
import { getSongCharts, getTimesPlayed } from "../utils/songInfo.js"
import { formatSongTitle } from "../utils/format.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const songDatabase = await SongDatabase.getInstance(pjskGoogleSheetsID)
const allSongs = songDatabase.getAllSongs()

const difficultyDatabase = await DifficultyDatabase.getInstance(pjskGoogleSheetsID)

const songsList = document.getElementById('songsList')

displaySongs()

function displaySongs() {
    allSongs.forEach(song => displaySong(song))
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

    songsList.innerHTML += `<li class="flex justify-between gap-8 bg-white shadow rounded-md p-5">
        <div class="flex items-center gap-4">
            <img class="rounded-full w-20 h-20"
                src="${song.imageUrl}"
                alt="">
            <div>
                <div>${formatSongTitle(song)}</div>
                <div class="font-normal text-gray-500">Played ${timesPlayed} time${timesPlayed === 1 ? '' : 's'}</div>
            </div>
        </div>
        <div class="flex flex-1 items-center justify-end gap-4">
            ${easyChart ? '<div class="flex-1 text-center rounded bg-green-400 text-white">' + easyChart.level + ' / ' + easyChart.length + '</div>' : ''}
            ${normalChart ? '<div class="flex-1 text-center rounded bg-blue-400 text-white">' + normalChart.level + ' / ' + normalChart.length + '</div>' : ''}
            ${hardChart ? '<div class="flex-1 text-center rounded bg-yellow-400 text-white">' + hardChart.level + ' / ' + hardChart.length + '</div>' : ''}
            ${expertChart ? '<div class="flex-1 text-center rounded bg-red-400 text-white">' + expertChart.level + ' / ' + expertChart.length + '</div>' : ''}
            ${masterChart ? '<div class="flex-1 text-center rounded bg-purple-400 text-white">' + masterChart.level + ' / ' + masterChart.length + '</div>' : ''}
            ${appendChart ? '<div class="flex-1 text-center rounded bg-fuchsia-400 text-white">' + appendChart.level + ' / ' + appendChart.length + '</div>' : ''}
        </div>
    </li>`
}