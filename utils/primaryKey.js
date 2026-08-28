export default function getPrimaryKeyString(primaryKey) {
    return primaryKey.map(col => ' ' + col.toString()).toString().substring(1)
}