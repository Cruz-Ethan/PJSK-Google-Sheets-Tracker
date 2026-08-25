export function getDate(dateString) {
    const matches = dateString.match(/\d+/g);
    const parts = matches.map(Number);
    return new Date(parts[0], parts[1], parts[2], parts[3], parts[4], parts[5]);
}

export function simpleDate(date) {
    const formatter = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric'
    });
    return formatter.format(date)
}

export function formatAccuracy(partial, total) {
    return Math.round(1000 * partial / total) / 10 + '%'
}

export function formatSongTitle(song) {
    if(song.song.length > 25) {
        return song.song.substring(0, 25) + "..."
    }
    return song.song
}

export function shorten(name) {
    if(name.length > 25) {
        return name.substring(0, 25) + "..."
    }
    return name
}