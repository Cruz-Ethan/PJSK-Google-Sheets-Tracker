import { getCurrentTalent, getSkillEffect } from "./cardInfo.js"

export function getTeamTalent(team) {
    let totalTalent = 0
    if(team.leader) totalTalent += getCurrentTalent(team.leader)
    if(team.subleader) totalTalent += getCurrentTalent(team.subleader)
    if(team.member1) totalTalent += getCurrentTalent(team.member1)
    if(team.member2) totalTalent += getCurrentTalent(team.member2)
    if(team.member3) totalTalent += getCurrentTalent(team.member3)
    return totalTalent
}

export function getTeamHealthBoost(team) {
    let totalHealthBoost = 0
    if(team.leader) totalHealthBoost += getSkillEffect(team.leader).healthBoost
    if(team.subleader) totalHealthBoost += getSkillEffect(team.subleader).healthBoost
    if(team.member1) totalHealthBoost += getSkillEffect(team.member1).healthBoost
    if(team.member2) totalHealthBoost += getSkillEffect(team.member2).healthBoost
    if(team.member3) totalHealthBoost += getSkillEffect(team.member3).healthBoost
    return totalHealthBoost
}

export function getTeamScoreBoost(team) {
    let teamScoreBoost = 0
    if(team.leader) teamScoreBoost += getSkillEffect(team.leader).scoreBoostPercentage
    if(team.subleader) teamScoreBoost += getSkillEffect(team.subleader).scoreBoostPercentage
    if(team.member1) teamScoreBoost += getSkillEffect(team.member1).scoreBoostPercentage
    if(team.member2) teamScoreBoost += getSkillEffect(team.member2).scoreBoostPercentage
    if(team.member3) teamScoreBoost += getSkillEffect(team.member3).scoreBoostPercentage
    return teamScoreBoost
}