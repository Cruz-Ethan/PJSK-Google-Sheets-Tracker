import ShowDatabase from "../databases/ShowDatabase.js";
import { displayShow } from "../utils/display.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const showDatabase = await ShowDatabase.getInstance(pjskGoogleSheetsID)
const allShows = showDatabase.getAllShows()

displayShows()

function displayShows() {
    allShows.sort((a, b) => b.time - a.time)
    const showsTable = document.getElementById('showsTable')
    allShows.forEach(show => {displayShow(showsTable, show)})
}