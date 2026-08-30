import ChartDatabase from "../databases/songs/ChartDatabase.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const chartDatabase = await ChartDatabase.getInstance(pjskGoogleSheetsID)

export function getChartLength(song, difficulty) {
    return chartDatabase.getChart(song, difficulty).length
}

export function getChartLevel(song, difficulty) {
    return chartDatabase.getChart(song, difficulty).level
}