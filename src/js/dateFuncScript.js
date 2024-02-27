function getThaiMonth(m) {
    const month_list = [
        'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน',
        'พฤษภาคม', 'มิถุนายน', 'กรกฎาคม', 'สิงหาคม',
        'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
    ]

    return month_list[parseInt(m) - 1]
}
function getShortThaiMonth(m) {
    const month_list = [
        'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
        'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
        'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
    ]

    return month_list[parseInt(m) - 1]
}

function getFullYearThai(y) {
    return parseInt(y) + 543
}
function getThaiMonthByFullDateLocal(date) {

    const [dt, time] = date.toString().split('T')
    const month = dt.split('-')[1]
    return month
}

function getYearByFullDateLocal(date) {

    const [dt, time] = date.toString().split('T')
    const year = dt.split('-')[0]
    return year
}

function getCountDate(d) {
    return d.toString().length == 2 ? d : `0${d}`
}

function getCountMonth(year, m) {
    return new Date(year, m, 0).getDate()
}

function setDate(stamp) {
    const d = new Date(stamp)
    const dt = getCountDate(d.getDate())
    const m = getCountDate(d.getMonth() + 1)
    const y = d.getFullYear()
    return `${y}-${m}-${dt}`
}
function getDateAndTimeByTimestamp(stamp) {
    const d = new Date(stamp)
    const dt = getCountDate(d.getDate())
    const m = getCountDate(d.getMonth() + 1)
    const y = d.getFullYear()
    const h = getCountDate(d.getHours())
    const minutes = getCountDate(d.getMinutes())
    const seconds = getCountDate(d.getSeconds())
    return `${y}-${m}-${dt} ${h}:${minutes}:${seconds}`
}
function getFullDateTimeisThaiByDateTimeLocalString(dateString) {
    const [date, time] = dateString.split('T')
    const [y, m, d] = date.split('-')
    const year = parseInt(y) + 543
    const month = getThaiMonth(m)
    const dt = parseInt(d)
    const [hour, minute] = time.split(':')
    return `วันที่ ${dt} ${month} ${year} เวลา ${hour}:${minute}`
}

function getFullDateTimeisThaiByDateTime(dateString) {
    const [date, time] = dateString.split(' ')
    const [y, m, d] = date.split('-')
    const year = parseInt(y) + 543
    const month = getThaiMonth(m)
    const dt = parseInt(d)
    const [hour, minute] = time.split(':')
    return `วันที่ ${dt} ${month} ${year} เวลา ${hour}:${minute}`
}


function getFullDateisThaiByDate(date) {
    const [y, m, d] = date.split('-')
    const year = parseInt(y) + 543
    const month = getThaiMonth(m)
    const dt = parseInt(d)
    return `วันที่ ${dt} ${month} ${year}`
}

function getDateTimeisThaiByDateTime(dateString) {
    const [date, time] = dateString.split(' ')
    const [y, m, d] = date.split('-')
    const year = parseInt(y) + 543
    const month = getShortThaiMonth(m)
    const dt = parseInt(d)
    const [hour, minute] = time.split(':')
    return `${dt} ${month} ${year} เวลา ${hour}:${minute}`
}

function getTimeStampisNow() {
    const now = setDate(new Date().valueOf())
    const stamp = new Date(`${now} 00:00:00`).valueOf()
    return stamp
}
function sumMonth(year, month) {
    return new Date(year, month, 0).getDate()
}

function getTimeStampByDate(date) {
    const stamp = new Date(`${date} 00:00:00`).valueOf()
    return stamp
}

function getDateIsNow() {
    const date = new Date()
    const y = date.getFullYear()
    const m = getCountDate(date.getMonth()+1)
    const dt = getCountDate(date.getDate())
    return `${y}-${m}-${dt}`
}