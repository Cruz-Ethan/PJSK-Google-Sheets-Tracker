import TeamDatabase from "../databases/cards/TeamDatabase.js";
import { getImageUrl } from "../utils/cardInfo.js";
import { getTeamTalent, getTeamHealthBoost, getTeamScoreBoost } from "../utils/teamInfo.js";
import { shorten } from "../utils/format.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const teamDatabase = await TeamDatabase.getInstance(pjskGoogleSheetsID)
const allTeams = teamDatabase.getAllTeams()

const teamsList = document.getElementById('teamsList')

const teamTitle = document.getElementById('teamTitle')

const minTalent = document.getElementById('minTalent')
const maxTalent = document.getElementById('maxTalent')
const minScoreBoost = document.getElementById('minScoreBoost')
const maxScoreBoost = document.getElementById('maxScoreBoost')
const minHealthBoost = document.getElementById('minHealthBoost')
const maxHealthBoost = document.getElementById('maxHealthBoost')

teamTitle.addEventListener('change', renderTeamList)
minTalent.addEventListener('change', renderTeamList)
maxTalent.addEventListener('change', renderTeamList)
minScoreBoost.addEventListener('change', renderTeamList)
maxScoreBoost.addEventListener('change', renderTeamList)
minHealthBoost.addEventListener('change', renderTeamList)
maxHealthBoost.addEventListener('change', renderTeamList)

renderTeamList()

function renderTeamList() {
    teamsList.innerHTML = ''
    allTeams.forEach(team => {
        if(!isFilterPassing(team)) return
        teamsList.innerHTML += `<li class="bg-white rounded shadow flex flex-col lg:grid grid-cols-5 justify-between">
                    <div class="bg-emerald-200 py-5 px-12 flex flex-col justify-center items-center rounded-t lg:rounded-tr-none lg:rounded-l col-span-1">
                        <div>
                            <h2 class="text-xl font-semibold">${shorten(team.team)}</h2>
                            <p class="hidden xl:block text-lg text-gray-500">Talent: ${getTeamTalent(team)}</p>
                            <p class="hidden xl:block text-lg text-gray-500">Health Boost: ${getTeamHealthBoost(team)}</p>
                            <p class="hidden xl:block text-lg text-gray-500">Score Boost: ${getTeamScoreBoost(team)}%</p>
                        </div>
                    </div>
                    <div class="p-4 2xl:px-16 2xl:py-5 grid grid-cols-[repeat(auto-fit,_minmax(150px,1fr))] sm:grid-cols-5 col-span-4 gap-4 2xl:gap-5 place-items-center">
                        ${team.leader ? '<img src="' + getImageUrl(team.leader) + '"  class="sm:w-full">' : '<div class="bg-gray-200 rounded-lg aspect-square sm:w-full"></div>'}
                        ${team.subleader ? '<img src="' + getImageUrl(team.subleader) + '"  class="sm:w-full">' : '<div class="bg-gray-200 rounded-lg aspect-square sm:w-full"></div>'}
                        ${team.member1 ? '<img src="' + getImageUrl(team.member1) + '"  class="sm:w-full">' : '<div class="bg-gray-200 rounded-lg aspect-square sm:w-full"></div>'}
                        ${team.member2 ? '<img src="' + getImageUrl(team.member2) + '"  class="sm:w-full">' : '<div class="bg-gray-200 rounded-lg aspect-square sm:w-full"></div>'}
                        ${team.member3 ? '<img src="' + getImageUrl(team.member3) + '" class="sm:w-full">' : '<div class="bg-gray-200 rounded-lg aspect-square sm:w-full"></div>'}
                    </div>
                </li>`
    })
}

function isFilterPassing(team) {
    if(!team.team.toLowerCase().includes(teamTitle.value.toLowerCase())) {
        return false
    }

    const teamTalent = getTeamTalent(team)
    if(teamTalent < minTalent.value || teamTalent > maxTalent.value) {
        return false
    }

    const teamHealthBoost = getTeamHealthBoost(team)
    if(teamHealthBoost < minHealthBoost.value || teamHealthBoost > maxHealthBoost.value) {
        return false
    }

    const teamScoreBoost = getTeamScoreBoost(team)
    if(teamScoreBoost < minScoreBoost.value || teamScoreBoost > maxScoreBoost.value) {
        return false
    }

    return true
}

