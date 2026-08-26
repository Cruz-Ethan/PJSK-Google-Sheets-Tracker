import { getTalent, getSkillEffect } from "./cardInfo.js"

export function getTeamTalent(team, time=new Date()) {
    let totalTalent = 0
    if(team.leader) totalTalent += getTalent(team.leader, time)
    if(team.subleader) totalTalent += getTalent(team.subleader, time)
    if(team.member1) totalTalent += getTalent(team.member1, time)
    if(team.member2) totalTalent += getTalent(team.member2, time)
    if(team.member3) totalTalent += getTalent(team.member3, time)
    return totalTalent
}

export function getTeamHealthBoost(team, time=new Date()) {
    let totalHealthBoost = 0
    if(team.leader) totalHealthBoost += getSkillEffect(team.leader, time).healthBoost * 2
    if(team.subleader) totalHealthBoost += getSkillEffect(team.subleader, time).healthBoost
    if(team.member1) totalHealthBoost += getSkillEffect(team.member1, time).healthBoost
    if(team.member2) totalHealthBoost += getSkillEffect(team.member2, time).healthBoost
    if(team.member3) totalHealthBoost += getSkillEffect(team.member3, time).healthBoost
    return totalHealthBoost
}

export function getTeamScoreBoost(team, time=new Date()) {
    let teamScoreBoost = 0
    if(team.leader) teamScoreBoost += getSkillEffect(team.leader, time).scoreBoostPercentage * 2
    if(team.subleader) teamScoreBoost += getSkillEffect(team.subleader, time).scoreBoostPercentage
    if(team.member1) teamScoreBoost += getSkillEffect(team.member1, time).scoreBoostPercentage
    if(team.member2) teamScoreBoost += getSkillEffect(team.member2, time).scoreBoostPercentage
    if(team.member3) teamScoreBoost += getSkillEffect(team.member3, time).scoreBoostPercentage
    return teamScoreBoost
}