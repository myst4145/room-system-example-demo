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
        'progress': 'text-muted',
        'all': 'text-success',
        'partial': 'text-dark',
        'cancel': 'text-dark'
    }

    const hasIndex = Object.keys(data).indexOf(status)
    return Object.values(data)[hasIndex] ?? ''

}

function getRentalTypeDisplay(rentalType) {
    const rentalTypeDict = { 'daily': 'รายวัน', 'daily-no-limit': 'ไม่กำหนดวัน', 'monthly': 'รายเดือน' }
    switch (rentalType) {
        case 'daily':
            rentalTypeString = 'รายวัน'
            break;
        case 'monthly':
            rentalTypeString = 'รายเดือน'
            break;
        default:
            rentalTypeString = 'ไม่ระบุ'
            break;
    }
    const h = Object.keys(rentalTypeDict).indexOf(rentalType)
    return i >= 0 ? Object.values(rentalTypeDict)[h] : 'ไม่ระบุ'
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
        progress: 'รอเข้าพัก',
        checkout: 'ออกแล้ว',
        checkin: 'พักอยู่',
    }
    const hasIndex = Object.keys(statusDict).indexOf(status)
    return hasIndex >= 0 ? Object.values(statusDict)[hasIndex] : 'ไม่ระบุ'
}

function getIdCard(id) {
    return `${id[0]}-${id.slice(1, 5)}-${id.slice(5, 13)}-${id[12]}`
}


function getGender(gender) {
    const genderDict = {
        'male': 'ชาย',
        'female': 'หญิง'
    }
    const hasIndex = Object.keys(genderDict).indexOf(gender)
    return hasIndex >= 0 ? Object.values(genderDict)[hasIndex] : ''
}

function thisPage(page) {
    return !page.includes('&') ? page : page.substring(0, page.indexOf('&'))
}

function setqueryParams(search, key) {
    return search != "" ? `&${key}=${search}` : "";
}

function checkOperator(op) {
    let params = "";
    if (op.includes("?") == true) {
        params = "&";
    } else if (op.includes("?") == false) {
        params = "?";
    }
    return params;
}

function getPaginatePageByThisPage(page) {
    const [, , , , search] = page.split('/')
    const p = new URLSearchParams(search).get('p')
    return `p=${p}`
}

function getPageIsSystem(search) {
    const p = new URLSearchParams(search).get('p')
    return `/system?p=${p}`
}