import CharacterDatabase from "../databases/CharacterDatabase.js";
import SupportUnitDatabase from "../databases/SupportUnitDatabase.js";
import { getRank } from "../utils/characterInfo.js";

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const characterDatabase = await CharacterDatabase.getInstance(pjskGoogleSheetsID)
const allCharacters = characterDatabase.getAllCharacters()

const supportUnitDatabase = await SupportUnitDatabase.getInstance(pjskGoogleSheetsID)
const allUnits = supportUnitDatabase.getAllSupportUnits()

const main = document.getElementById('main')

allUnits.forEach(unit => {
    const section = document.createElement('section')
    section.classList.add("mb-10")
    
    const title = document.createElement('h2')
    title.innerText = unit.supportUnit
    title.classList.add("text-2xl", "font-semibold", "mb-3")
    section.appendChild(title)

    const unitCharacters = allCharacters.filter(character => character.supportUnit === unit.supportUnit)

    const list = document.createElement('ul')
    list.classList.add("grid", `grid-cols-6`, "gap-4")
    section.appendChild(list)

    unitCharacters.forEach(character => {
        list.innerHTML += `<li class="shadow rounded bg-white flex flex-col">
                    <img class="p-5" src="${character.imageUrl}" alt="${character.character}">
                    <div class="text-center bg-emerald-200 p-5 rounded-b flex-1">
                        <h2 class="text-xl font-semibold">${character.character}</h2>
                        <p class="text-lg text-gray-500">Rank ${getRank(character)}</p>
                    </div>
                </li>`
    })

    main.appendChild(section)
})