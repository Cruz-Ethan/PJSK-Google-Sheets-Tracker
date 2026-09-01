import { getPerfectAccuracy, getClearStatus, getStatusStyle } from "./showInfo.js"
import { getRankColor, getDifficultyColor } from "./colors.js"
import { simpleDate, formatSongTitle } from "./format.js"

export function displayShow(showTable, show) {
    showTable.innerHTML += `<div class="min-h-50 md:min-h-0 md:col-span-7 flex flex-col md:grid grid-cols-7 gap-2 rounded bg-white md:bg-transparent shadow md:shadow-none">
        <div class="text-center hidden md:block">${simpleDate(show.time)}</div>
        <div class="p-4 md:p-0 relative rounded col-span-2 bg-cover bg-[position:5%_25%] bg-no-repeat bg-[url(${show.song.imageUrl})] flex-1 flex flex-col items-center justify-center gap-2 md:gap-0">
            <div class="absolute inset-0 bg-white/30 backdrop-grayscale-200 rounded"></div>
            <div class="absolute inset-0 bg-white/30 backdrop-saturate-200 rounded"></div>
            <div class="absolute inset-0 bg-${getDifficultyColor(show.difficulty)} opacity-50 rounded"></div>
            <div class="text-center z-10 text-white">${formatSongTitle(show.song)}</div>
            <div class="block md:hidden text-center z-10 text-white">${simpleDate(show.time)}</div>
        </div>
        <div class="mx-4 md:m-0 text-center text-${getRankColor(show.rank)}">${show.score}</div>
        <div class="${getStatusStyle(show)} mx-4">${getClearStatus(show)}</div>
        <div class="mt-0 m-4 md:m-0 text-center col-span-2 rounded bg-linear-to-r from-green-300 from-${Math.round(getPerfectAccuracy(show))}% to-${Math.round(getPerfectAccuracy(show))}% border-2 border-green-500 text-green-700">${Math.round(10 * getPerfectAccuracy(show)) / 10}%</div>
    </div>`
}