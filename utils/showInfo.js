import ChartDatabase from "../databases/ChartDatabase.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const chartDatabase = await ChartDatabase.getInstance(pjskGoogleSheetsID)

export function getPerfectAccuracy(show) {
    return 100 * show.perfects / getShowLength(show)
}

export function getClearStatus(show) {
    if(show.failed) return 'Failed'
    if(show.perfects === getShowLength(show)) return 'All Perfect'
    if(show.perfects + show.greats === getShowLength(show)) return 'Full Combo'
    return 'Cleared'
}

export function getStatusStyle(show) {
    switch(getClearStatus(show)) {
        case 'All Perfect': return "text-center text-white bg-linear-to-r/longer from-yellow-400 to-cyan-500 to-90% rounded shadow-lg"
        case 'Full Combo': return "text-center text-white bg-linear-to-r rounded from-purple-400 to-indigo-500"
        case 'Failed': return "text-center text-white bg-linear-to-r rounded from-rose-400 to-red-500"
        default: return "text-center"
    }
}

export function getShowLength(show) {
    return chartDatabase.getChart(show.song, show.difficulty).length
}

export function getShowLevel(show) {
    return chartDatabase.getChart(show.song, show.difficulty).level
}