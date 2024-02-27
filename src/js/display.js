class Display {
    static getRoomType(roomType) {
        const roomDict = {
            'standard': 'Standard',
            'superior': 'Superior',
            'deluxe': 'Deluxe',
            'suite': 'Suite',
            'family': 'Family',
            'studio': 'Studio',
            'connecting': 'Connecting',
            'duplex': 'Duplex',
            'villa': 'Villa',
            'adjoining': 'Adjoining',
            'cabana': 'Cabana',
            'honeymoon': 'Honeymoon',
            'roomtype-no-specify': 'ไม่ระบุ'
        }
        const idx = Object.keys(roomDict).indexOf(roomType)
        return idx >= 0 ? Object.values(roomDict)[idx] : ''

    }
    static getBedType(bed) {

        const bedTypeDict = {
            'king-sized': 'King Sized',
            'queen-sized': 'Queen Sized',
            'single-bed': 'Single',
            'twin-bed': 'Twin',
            'double-bed': 'Double',
            'triple-bed': 'Triple',
            'quad-bed': 'Quad',
            'bedtype-no-specify': 'ไม่ระบุ'
        }
        const idx = Object.keys(bedTypeDict).indexOf(bed)
        return idx >= 0 ? Object.values(bedTypeDict)[idx] : ''
    }
    static toCapitalize(str) {
        const firstChar = str.substring(0, 1).toUpperCase()
        const capitalize = `${firstChar}${str.substring(1)}`
        return capitalize
    }
    static getRoomview(view) {
        const roomViewDict =
        {
            'garden-view': 'Garden View',
            'seaview': 'Seaview',
            'poolview': 'Pool View',
            'pool-access': 'Pool Acces',
            'beach-front': 'Beach Front',
            'view-no-specify': 'ไม่ระบุ'
        }
        const idx = Object.keys(roomViewDict).indexOf(view)
        return idx >= 0 ? Object.values(roomViewDict)[idx] : 'ทั่วไป ไม่ระบุ'

    }
    static unitTimes(unit) {

        return [
            { 'key': 'minutes', 'value': 'นาที' },
            { 'key': 'hours', 'value': 'ชั่วโมง' },
            { 'key': 'days', 'value': 'วัน' },
            { 'key': 'weeks', 'value': 'สัปดาห์' },
            { 'key': 'months', 'value': 'เดือน' },
            { 'key': 'years', 'value': 'ปี' },
            { 'key': 'today', 'value': 'วันนี้' },
            { 'key': 'this_week', 'value': 'สัปดาห์นี้' },
            { 'key': 'this_month', 'value': 'เดือนนี้' },
            { 'key': 'this_year', 'value': 'ปีนี้' }
        ].filter((u) => u.key == unit)[0].value
    }

    static resSpecialOptions(opt) {
        const data =
            [
                { 'key': 'non-special-options', 'value': 'ไม่มี' },
                { 'key': 'fridge', 'value': 'ตู้เย็น' },
                { 'key': 'fan', 'value': 'พัดลม' },
                { 'key': 'air', 'value': 'แอร์' },
                { 'key': 'microwave', 'value': 'ไมโครเวฟ' },
                { 'key': 'tv', 'value': 'TV' },
                { 'key': 'washing-machine', 'value': 'เครื่องซักผ้า' },
                { 'key': 'electric-pan', 'value': 'กระทะไฟฟ้า ' },
                { 'key': 'induction-stove', 'value': 'เตาแม่เหล็กไฟฟ้า' },
                { 'key': 'vacuum-cleaner', 'value': 'เครื่องดูดฝุ่น' },
                { 'key': 'electric-kettle', 'value': 'กาต้มน้ำไฟฟ้า' },
                { 'key': 'water-heater', 'value': 'เครื่องทำน้ำอุ่น' },
                { 'key': 'bathtub', 'value': 'อ่างอาบน้ำ' },
            ].filter((d) => d.key == opt)

        return data.length > 0 ? data[0].value : opt
    }

    static setNumberFormat(num) {
        num = Math.round(Number.parseFloat(num))
        return new Intl.NumberFormat('th-TH', {
            style: "currency",
            currency: 'THB'
        }).format(num)
    }

    static countDate(d) {
        return d.toString().length == 1 ? `0${d}` : d
    }
    static setPayment(p) {
        return p == 'cash-payment' ? 'จ่ายเงินสด' : 'โอนผ่านธนาคาร'
    }
    static getBank(bank) {
        return [
            { 'key': 'bbl', 'value': 'ธนาคารกรุงเทพ' },
            { 'key': 'k-bank', 'value': 'ธนาคารกสิกรไทย' },
            { 'key': 'ktb', 'value': 'ธนาคารกรุงไทย' },
            { 'key': 'ttb', 'value': 'ธนาคารทหารไทยธนชาต' },
            { 'key': 'scb', 'value': 'ธนาคารไทยพาณิชย์' },
            { 'key': 'uob', 'value': 'ธนาคารยูโอบี' },
            { 'key': 'bay', 'value': 'ธนาคารกรุงศรีอยุธยา' },
            { 'key': 'gsb', 'value': 'ธนาคารออมสิน' },
            { 'key': 'baac', 'value': 'ธนาคารเพื่อการเกษตรและสหกรณ์การเกษตร' },
            { 'key': 'tisco', 'value': 'ธนาคารทิสโก้' },
            { 'key': 'cimb', 'value': 'ธนาคารซีไอเอ็มบีไทย' },
            { 'key': 'kkp', 'value': 'ธนาคารเกียรตินาคินภัทร' }
        ].filter(e => e.key == bank)[0].value
    }

    static privateLevelDisplay(level) {
        return [
            { 'key': 'genaral', 'value': 'ทั่วไป' },
            { 'key': 'manager', 'value': 'ผู้จัดการ' },
            { 'key': 'admin-p', 'value': 'ผู้ดูระบบ' },
            { 'key': 'cashier', 'value': 'แคชเชียร์' },
        ].filter(e => e.key == level)[0].value
    }
    static payStatus(status) {
        return [
            { 'key': 'pending', 'value': 'รอการยืนยัน' },
            { 'key': 'paid', 'value': 'ชำระแล้ว' },
            { 'key': 'unpiad', 'value': 'ยังไม่ชำระ' },
        ].filter(e => e.key == status)[0].value
    }
    static bookingStatus(status) {
        return [
            { 'key': 'progress', 'value': 'รอการยืนยัน' },
            { 'key': 'cancel', 'value': 'ถูกยกเลิก' },
            { 'key': 'confirm', 'value': 'ยันยันแล้ว' },
            { 'key': 'resting', 'value': 'พักอยู่' },
            { 'key': 'success', 'value': 'เช็คอินเรียบร้อย' },
        ].filter((e => e.key == status))[0].value
    }
    static setDateAndTime(stamp) {
        const d = new Date(stamp)
        const dt = this.countDate(d.getDate())
        const m = this.countDate(d.getMonth() + 1)
        const y = d.getFullYear()
        const hour = d.getHours()
        const minutes = d.getMinutes()

        return `${y}-${m}-${dt} ${hour}:${minutes}`
    }
    static sumMonth() {
        const timestamp = new Date().valueOf()
        const now = this.setDate(timestamp)
        const [year, month, date] = now.split('-')
        return new Date(year, month, 0).getDate()
    }
    static setDate(stamp) {
        const d = new Date(stamp)
        const dt = this.countDate(d.getDate())
        const m = this.countDate(d.getMonth() + 1)
        const y = d.getFullYear()
        return `${y}-${m}-${dt}`
    }
    static setTimes(stamp) {
        const d = new Date(stamp)
        const h = this.countDate(d.getHours())
        const i = this.countDate(d.getMinutes())
        const s = this.countDate(d.setSeconds())
        return `${h}:${i}:${s}`
    }
    static setBankNumberFormat(number, bank) {
        let format = ''

        if (bank == 'k-bank' || 'ttb' || 'bay' || 'ktb' || 'cimb') {
            format = number.substring(0, 3) + '-'
            format += number.substring(3, 4) + '-'
            format += number.substring(4, 9) + '-'
            format += number.substring(9)
        }

        if (bank == 'scb') {
            format = number.substring(0, 3) + '-'
            format += number.substring(3, 9) + '-'
            format += number.substring(9)
        }
        if (bank == 'bbl') {
            format = number.substring(0, 3) + '-'
            format += number.substring(3, 4) + '-'
            format += number.substring(4)
        }
        if (bank == 'uob') {
            format = number.substring(0, 3) + '-'
            format += number.substring(3, 6) + '-'
            format += number.substring(6, 9) + '-'
            format += number.substring(9)
        }
        if (bank == 'tisco') {
            format = number.substring(0, 4) + '-'
            format += number.substring(4, 7) + '-'
            format += number.substring(7, 13) + '-'
            format += number.substring(13)
        }
        if (bank == 'gsb') {
            format = number.substring(0, 1) + '-'
            format += number.substring(1, 4) + '-'
            format += number.substring(4, 8) + '-'
            format += number.substring(8)
        }

        return format
    }
}

module.exports.display = Display