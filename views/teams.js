import TeamDatabase from "../databases/TeamDatabase.js";
import { getCurrentImageUrl } from "../utils/cardInfo.js";
import { getTeamTalent, getTeamHealthBoost, getTeamScoreBoost } from "../utils/teamInfo.js";
import { shorten } from "../utils/format.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const teamDatabase = await TeamDatabase.getInstance(pjskGoogleSheetsID)
const allTeams = teamDatabase.getAllTeams()

const teamsList = document.getElementById('teamsList')

allTeams.forEach(team => {
    teamsList.innerHTML += `<li class="bg-white rounded shadow grid grid-cols-5 justify-between">
                    <div class="bg-emerald-200 py-5 px-12 flex flex-col justify-center items-center rounded-l col-span-1">
                        <div>
                            <h2 class="text-xl font-semibold">${shorten(team.team)}</h2>
                            <p class="text-lg text-gray-500">Talent: ${getTeamTalent(team)}</p>
                            <p class="text-lg text-gray-500">Health Boost: ${getTeamHealthBoost(team)}</p>
                            <p class="text-lg text-gray-500">Score Boost: ${getTeamScoreBoost(team)}%</p>
                        </div>
                    </div>
                    <div class="px-16 py-5 grid grid-cols-5 col-span-4 gap-5">
                        <img src="${team.leader ? getCurrentImageUrl(team.leader) : ''}" class="bg-gray-200 rounded aspect-square w-full" alt="">
                        <img src="${team.subleader ? getCurrentImageUrl(team.subleader) : ''}" class="bg-gray-200 rounded aspect-square w-full" alt="">
                        <img src="${team.member1 ? getCurrentImageUrl(team.member1) : ''}" class="bg-gray-200 rounded aspect-square w-full" alt="">
                        <img src="${team.member2 ? getCurrentImageUrl(team.member2) : ''}" class="bg-gray-200 rounded aspect-square w-full" alt="">
                        <img src="${team.member3 ? getCurrentImageUrl(team.member3) : ''}" class="bg-gray-200 rounded aspect-square w-full" alt="">
                    </div>
                </li>`
})