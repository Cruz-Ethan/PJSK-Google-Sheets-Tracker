import { getPerfectAccuracy, getClearStatus, getStatusStyle } from "./showInfo.js"
import { getRankColor, getDifficultyColor } from "./colors.js"
import { simpleDate, formatSongTitle } from "./format.js"

export function displayShow(showTable, show) {
    showTable.innerHTML += `<div class="col-span-7 grid grid-cols-7 gap-2">
        <div class="text-center">${simpleDate(show.time)}</div>
        <div class="relative rounded col-span-2 bg-cover bg-[position:5%_25%] bg-no-repeat bg-[url(${show.song.imageUrl})]">
            <div class="absolute inset-0 bg-white/30 backdrop-grayscale-200"></div>
            <div class="absolute inset-0 bg-white/30 backdrop-saturate-200"></div>
            <div class="absolute inset-0 bg-${getDifficultyColor(show.difficulty)} opacity-50 rounded"></div>
            <div class="absolute inset-0 text-center z-10 text-white">${formatSongTitle(show.song)}</div>
        </div>
        <div class="text-center text-${getRankColor(show.rank)}">${show.score}</div>
        <div class="${getStatusStyle(show)}">${getClearStatus(show)}</div>
        <div class="text-center col-span-2 rounded bg-linear-to-r from-green-300 from-${Math.round(getPerfectAccuracy(show))}% to-${Math.round(getPerfectAccuracy(show))}% border-2 border-green-500 text-green-700">${Math.round(10 * getPerfectAccuracy(show)) / 10}%</div>
    </div>`
}