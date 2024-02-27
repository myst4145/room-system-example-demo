function getTransactionPayAt(status) {
    const data = {
        'progress': 'รอดำเนินการ',
        'cancel': 'ยกเลิก',
        'all': 'ชำระแล้ว',
        'partial': 'ชำระยังไม่ครบ'
    }

    const hasIndex = Object.keys(data).indexOf(status)
    return Object.values(data)[hasIndex] ?? ''

}

function getTransactionPayAtText(status) {
    const data = {
        'progress': 'text-secondary',
        'all': 'text-success',
        'partial': 'text-info',
        'cancel': 'text-danger'
    }

    const hasIndex = Object.keys(data).indexOf(status)
    return Object.values(data)[hasIndex] ?? ''

}

function getRentalTypeDisplay(rentalType) {
    const rentalTypeDict = {
        'daily': 'รายวัน',
        'daily-no-limit': 'ไม่กำหนดวัน',
        'monthly': 'รายเดือน'
    }

    const h = Object.keys(rentalTypeDict).indexOf(rentalType)
    return h >= 0 ? Object.values(rentalTypeDict)[h] : 'ไม่ระบุ'
}

function getUnitTimeDisplay(unitTime) {
    let unitTimeString = ''
    switch (unitTime) {
        case 'days':
            unitTimeString = 'วัน'
            break;
        case 'months':
            unitTimeString = 'เดือน'
            break;
        default:
            rentalTypeString = 'ไม่ระบุ'
            break;
    }

    return unitTimeString
}
function getNumberPhoneDisplay(phone) {
    const start = phone.substring(0, 3)
    const end = phone.substring(2)
    return `${start}-${end}`
}

function getNumberFormat(number) {
    let n = new Intl.NumberFormat({ style: 'currency' }).format(
        number,
    )
    return n.includes('.') ? n : n + '.00'
}
function getRentalStatus(status) {
    const statusDict = {
        progress: 'รอยืนยัน',
        checkout: 'ออกแล้ว',
        checkin: 'พักอยู่',
        confirm: 'รอเข้าพัก',
        cancel: 'ยกเลิก',
    }
    const hasIndex = Object.keys(statusDict).indexOf(status)
    return hasIndex >= 0 ? Object.values(statusDict)[hasIndex] : 'ไม่ระบุ'
}
function getPaymentStatus(status) {
    const statusDict = {
        pending: 'รอการยืนยัน',
        paid: 'ชำระแล้ว',
        unpaid: 'ยังไม่ชำระ',
        cancel: 'ยกเลิก',
    }
    const hasIndex = Object.keys(statusDict).indexOf(status)
    return hasIndex >= 0 ? Object.values(statusDict)[hasIndex] : 'ไม่ระบุ'
}

function getPromotionTypeFormat(type) {
    const data = {
        percent: '%',
        currency: 'บาท',
    }
    console.log(type)
    const hasIndex = Object.keys(data).indexOf(type)
    return hasIndex >= 0 ? Object.values(data)[hasIndex] : 'ไม่ระบุ'
}
function getPercentByNumber(num, percent) {
    return Math.floor(((num * percent) % 100))
}
function sumByreduce(list) {
    const sum = list.reduce((prev, current) => parseFloat(prev) + parseFloat(current), 0)
    return sum
}
module.exports =
{
    getTransactionPayAt, getTransactionPayAtText,
    getRentalTypeDisplay, getUnitTimeDisplay, getNumberFormat,
    getRentalStatus, getNumberPhoneDisplay,
    getPaymentStatus, getPromotionTypeFormat, getPercentByNumber,
    sumByreduce
}