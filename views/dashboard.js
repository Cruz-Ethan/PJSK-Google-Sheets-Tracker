import ShowDatabase from "../databases/ShowDatabase.js";
import { simpleDate, formatAccuracy } from "../utils/format.js";
import { getScoreColor, getDifficultyColor, getRankColor,  getLevelColor } from "../utils/colors.js";
import { getShowLevel } from "../utils/showInfo.js";
import { displayShow } from "../utils/display.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const showDatabase = await ShowDatabase.getInstance(pjskGoogleSheetsID)
const allShows = showDatabase.getAllShows()

displayAccuracy()
displaySongStatistics()
displayRecentShows()

function displayRecentShows() {
    allShows.sort((a, b) => b.time - a.time)
    const showsTable = document.getElementById('showsTable')
    for(let i = 0; i < Math.min(allShows.length, 3); i++) {
        displayShow(showsTable, allShows[i])
    }
}

function displaySongStatistics() {
    const averageLevel = allShows.reduce((levelSum, show) => levelSum + getShowLevel(show), 0) / allShows.length
    const averageScore = allShows.reduce((scoreSum, show) => scoreSum + show.score, 0) / allShows.length

    allShows.sort((a, b) => a.score - b.score)
    const medianRank = allShows[Math.round(allShows.length / 2)].rank

    const modeSong = getModeSong()

    const averageLevelStatistic = document.getElementById('averageLevelStatistic')
    averageLevelStatistic.innerText = Math.round(10 * averageLevel) / 10
    averageLevelStatistic.classList.add(`text-${getLevelColor(averageLevel)}`)

    const averageScoreStatistic = document.getElementById('averageScoreStatistic')
    averageScoreStatistic.innerText = Math.round(averageScore)
    averageScoreStatistic.classList.add(`text-${getScoreColor(averageScore)}`)

    const medianRankStatistic = document.getElementById('medianRankStatistic')
    medianRankStatistic.innerText = medianRank
    medianRankStatistic.classList.add(`text-${getRankColor(medianRank)}`)

    const modeSongStatistic = document.getElementById('modeSongStatistic')
    modeSongStatistic.innerText = modeSong.song

    const modeSongBackground = document.getElementById('modeSongBackground')
    modeSongBackground.classList.add(`bg-[url(${modeSong.imageUrl})]`)
}

function getModeSong() {
    const frequencies = allShows.reduce((acc, show) => acc.set(show.song, (acc.get(show.song) || 0) + 1), new Map());
    return [...frequencies.entries()].reduce((a, b) => (b[1] > a[1] ? b : a))[0];
}

function displayAccuracy() {
    const perfects = allShows.reduce((perfectSum, show) => perfectSum + show.perfects, 0)
    const greats = allShows.reduce((perfectSum, show) => perfectSum + show.greats, 0)
    const goods = allShows.reduce((perfectSum, show) => perfectSum + show.goods, 0)
    const bads = allShows.reduce((perfectSum, show) => perfectSum + show.bads, 0)
    const misses = allShows.reduce((perfectSum, show) => perfectSum + show.misses, 0)
    const total = perfects + greats + goods + bads + misses

    const perfectStatistic = document.getElementById('perfectStatistic')
    perfectStatistic.innerText = formatAccuracy(perfects, total)

    const greatStatistic = document.getElementById('greatStatistic')
    greatStatistic.innerText = formatAccuracy(greats, total)

    const goodStatistic = document.getElementById('goodStatistic')
    goodStatistic.innerText = formatAccuracy(goods, total)

    const badStatistic = document.getElementById('badStatistic')
    badStatistic.innerText = formatAccuracy(bads, total)

    const missStatistic = document.getElementById('missStatistic')
    missStatistic.innerText = formatAccuracy(misses, total)
}