export default function getSnapshot(snapshots, item, time=new Date()) {
    const filteredSnapshots = snapshots.filter(snapshot => snapshot.matches(item) && snapshot.time < time)
    if(!filteredSnapshots) return null
    return filteredSnapshots.reduce((prev, curr) => curr.time > prev.time ? curr : prev, filteredSnapshots[0])
}