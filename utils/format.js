const simpleFormatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
});

export function getDate(dateString) {
    const matches = dateString.match(/\d+/g);
    const parts = matches.map(Number);
    return new Date(...parts);
}

export function simpleDate(date) {
    return simpleFormatter.format(date)
}

export function formatAccuracy(partial, total) {
    return Math.round(1000 * partial / total) / 10 + '%'
}

export function formatSongTitle(song) {
    return shorten(song.song)
}

export function shorten(name) {
    return name.length > 25 ? name.substring(0, 25) + "..." : name
}