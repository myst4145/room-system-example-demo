function getDataEntriesCount(sqlString, replaceString, field) {
    return sqlString.replaceAll(replaceString, `COUNT(${field}) as count`)
}
module.exports = { getDataEntriesCount }