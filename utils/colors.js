export function getRankColor(rank) {
    switch(rank) {
        case 'S': return 'pink-400'
        case 'A': return 'fuchsia-400'
        case 'B': return 'indigo-400'
        case 'C': return 'emerald-400'
        default: return 'red-400'
    }
}

export function getScoreColor(score) {
    if(score > 1150000) return 'pink-400'
    if(score > 900000) return 'fuchsia-400'
    if(score > 450000) return 'indigo-400'
    if(score > 45000) return 'emerald-400'
    return 'red-400'
}

export function getDifficultyColor(difficulty) {
    switch(difficulty.difficulty) {
        case 'easy': return 'green-600'
        case 'normal': return 'blue-600'
        case 'hard': return 'yellow-600'
        case 'expert': return 'red-600'
        case 'master': return 'purple-600'
        default: return 'fuchsia-600'
    }
}

export function getLevelColor(level) {
    if(level >= 35) return 'fuchsia-400'
    if(level >= 31) return 'purple-400'
    if(level >= 24) return 'red-400'
    if(level >= 16) return 'yellow-400'
    if(score >= 9) return 'blue-400'
    return 'green-600'
}