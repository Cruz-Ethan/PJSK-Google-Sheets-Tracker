import ChartDatabase from "../databases/songs/ChartDatabase.js"
import ShowDatabase from "../databases/songs/ShowDatabase.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const chartDatabase = await ChartDatabase.getInstance(pjskGoogleSheetsID)
const allCharts = chartDatabase.getAllCharts()

const showDatabase = await ShowDatabase.getInstance(pjskGoogleSheetsID)
const allShows = showDatabase.getAllShows()

export function getSongCharts(song) {
    return allCharts.filter(chart => chart.song === song)
}

export function getTimesPlayed(song) {
    return allShows.filter(show => show.song === song).length
}