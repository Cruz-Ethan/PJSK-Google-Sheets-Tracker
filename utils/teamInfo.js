import AttributeItemSnapshotDatabase from "../databases/snapshots/AttributeItemSnapshotDatabase.js"
import AttributeAreaItemDatabase from "../databases/items/AttributeAreaItemDatabase.js"
import CharacterAreaItemDatabase from "../databases/items/CharacterAreaItemDatabase.js"
import CharacterItemSnapshotDatabase from "../databases/snapshots/CharacterItemSnapshotDatabase.js"
import UnitAreaItemDatabase from "../databases/items/UnitAreaItemDatabase.js"
import UnitItemSnapshotDatabase from "../databases/snapshots/UnitItemSnapshotDatabase.js"
import getTalentBoost from "./areaItems.js"
import { getRankTalentBoost } from "./characterInfo.js"
import { getTalent, getHealthBoost, getScoreBoostPercentage } from "./cardInfo.js"

const pjskGoogleSheetsID = localStorage.getItem('pjskGoogleSheetsID')
if (!pjskGoogleSheetsID) window.location.href = 'index.html'

const attributeItemSnapshotDatabase = await AttributeItemSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allAttributeItemSnapshots = attributeItemSnapshotDatabase.getAllAttributeItemSnapshots()

const attributeItemDatabase = await AttributeAreaItemDatabase.getInstance(pjskGoogleSheetsID)
const allAttributeItems = attributeItemDatabase.getAllAttributeAreaItems()

const characterItemDatabase = await CharacterAreaItemDatabase.getInstance(pjskGoogleSheetsID)
const allCharacterItems = characterItemDatabase.getAllCharacterAreaItems()

const characterItemSnapshotDatabase = await CharacterItemSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allCharacterItemSnapshots = await characterItemSnapshotDatabase.getAllCharacterItemSnapshots()

const unitItemDatabase = await UnitAreaItemDatabase.getInstance(pjskGoogleSheetsID)
const allUnitItems = unitItemDatabase.getAllUnitAreaItems()

const unitItemSnapshotDatabase = await UnitItemSnapshotDatabase.getInstance(pjskGoogleSheetsID)
const allUnitItemSnapshots = unitItemSnapshotDatabase.getAllUnitItemSnapshots()

export function getTeamTalent(team, time = new Date()) {
    const members = getTeamMembers(team)
    const rawTalent = members.reduce( (total, member) => {
        return total + getTalent(member, time)
    }, 0)

    const decorationBonus = getDecorationBonus(members, time)
    const characterRankBonus = getCharacterRankBonus(members, time)

    return rawTalent + decorationBonus + characterRankBonus
}

export function getTeamHealthBoost(team, time = new Date()) {
    const members = getTeamMembers(team)
    return members.reduce(
        (total, member) => {
            return total + getHealthBoost(member, time)
        },
        getHealthBoost(team.leader, time)
    )
}

export function getTeamScoreBoost(team, time = new Date()) {
    const members = getTeamMembers(team)
    return members.reduce(
        (total, member) => {
            return total + getScoreBoostPercentage(member, time)
        },
        getScoreBoostPercentage(team.leader, time)
    )
}

export function getDecorationBonus(members, time=new Date()) {
    const attributeMultiplier = hasSameAttributes(members) ? 2 : 1
    const attributeTalentBoost = members.reduce((total, member) => {
        return total + getTalentBoost(allAttributeItemSnapshots, allAttributeItems, member, time)
    }, 0
    ) * attributeMultiplier

    const characterTalentBoost = members.reduce((total, member) => {
        return total + getTalentBoost(allCharacterItemSnapshots, allCharacterItems, member, time)
    }, 0
    )

    const unitMultiplier = hasSameUnit(members) ? 2 : 1
    const unitTalentBoost = members.reduce((total, member) => {
        return total + getTalentBoost(allUnitItemSnapshots, allUnitItems, member, time)
    }, 0
    ) * unitMultiplier

    return attributeTalentBoost + characterTalentBoost + unitTalentBoost
}

export function getCharacterRankBonus(members, time=new Date()) {
    return members.reduce((total, member) => {
        return total + getRankTalentBoost(member, time)
    }, 0) - members.length
}

function getTeamMembers(team) {
    const members = [team.leader]

    if (!team.subleader) {
        return members
    }
    members.push(team.subleader)

    if (!team.member1) {
        return members
    }
    members.push(team.member1)

    if (!team.member2) {
        return members
    }
    members.push(team.member2)

    if (!team.member3) {
        return members
    }
    members.push(team.member3)

    return members
}

function hasSameAttributes(members) {
    return members.reduce((areAllSame, member) => {
        return areAllSame && (member.attribute === members[0].attribute)
    }, true)
}

function hasSameUnit(members) {
    return members.reduce((areAllSame, member) => {
        return areAllSame && (member.supportUnit === members[0].supportUnit)
    }, true)
}