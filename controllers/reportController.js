const { condb, db } = require('../modules/DB')
const { display } = require('../src/js/display')
const { getCountFullDate, createRandom } = require('../src/js/function')
const fs = require('fs')
const path = require('path')
const notfoundPage = 'errNotfound'
const PDFDocument = require("pdfkit-table");
const FPDF = require('node-fpdf')
const { getDateisShortThai, getDateisFullThai, getDateTimeisThaiByDateTime } = require('../src/js/dateFunc')
const { getRentalTypeDisplay, getNumberFormat, getUnitTimeDisplay } = require('../src/js/func')
const { getDateStampisDailyQuery, getDateStampisMonthlyQuery } = require('../modules/getChecinAndCheckoutDate')
const { currencyThaiFormat } = require('../src/js/func/currencyThai')
const { getCompanyField } = require('../modules/getFieldName')
const pdf = new FPDF('P', 'mm', 'A4');

async function getReportData(req, res) {
    const checkin = req.query.checkin
    const checkout = req.query.checkout
    const rental_type = req.query.rental_type
    let date_stamp = rental_type == 'monthly'
        ? getDateStampisMonthlyQuery(checkin, checkout)
        : getDateStampisDailyQuery(checkin, checkout)

    let booking_sql = `SELECT booking_id,total,damages,fname,`
    booking_sql += `lname,room_number_id,checkin,checkout,status,`
    booking_sql += `date_stamp,rental_type FROM room_booking `
    booking_sql += ` WHERE rental_type='${rental_type}' AND (`


    date_stamp.forEach((t, idx) => {
        booking_sql += ` date_stamp LIKE '%${t}%'`
        if (idx < date_stamp.length - 1) booking_sql += ' OR '
    })

    booking_sql += `)`
    const roomsData = await db(`SELECT room_id,room_sub FROM rooms `)
    roomsData.map((r) => {
        const sub = JSON.parse(r.room_sub)
        r.room_sub = sub
        return r
    })
    const buildingData = await db(`SELECT * FROM building `)
    let reportList = []
    const reportData = await db(booking_sql)
    reportData.forEach((r) => {
        let room_number = ''
        let building_floor = ''
        let building = {}
        roomsData.forEach((s) => {
            const findIdx = s.room_sub.findIndex((d) => d.room_number_id == r.room_number_id)
            if (findIdx >= 0) {
                room_number = s.room_sub[findIdx].room_number
                building_floor = s.room_sub[findIdx].building_floor
                const building_id = s.room_sub[findIdx].building
                const hasBuilding = buildingData.findIndex((b) => b.building_id == building_id)
                if (hasBuilding >= 0) building = buildingData[hasBuilding]
            }
        })
        let data = {
            booking_id: r.booking_id,
            building_name: building.building_name,
            building_floor,
            room_number,
            fname: r.fname, lname: r.lname,
            checkin: getDateisFullThai(r.checkin),
            checkout: getDateisFullThai(r.checkout),
            damages: r.damages,
            damages_format: getNumberFormat(r.damages),
            total: r.total,
            total_format: getNumberFormat(r.total)
        }
        if (!rental_type) {
            Object.assign(data, {
                rental_type: getRentalTypeDisplay(r.rental_type)
            })
        }
        reportList.push(data)
    })
    return reportList
}

function getColumnWidth(n, alignment) {
    const paperHeight = alignment == 'horizontal' ? 793 : 554
    return Math.floor((n * paperHeight) / 100) - 1
}

function getReportTableHeaders(alignment) {
    const valign = "center"
    const headerColor = "#FFF"
    const headerOpacity = 1
    return [
        {
            label: "เลขที่จอง",
            width: getColumnWidth(18, alignment),
            property: 'booking_id',
            valign,
            headerColor,
            headerOpacity,
        },
        {
            label: `ตึก\nหมายเลขห้อง`,
            width: getColumnWidth(17, alignment),
            property: 'room_number',
            valign,
            headerColor,
            headerOpacity
        },
        {
            label: `ชื่อ\nนามสกุล`,
            property: 'name',
            width: getColumnWidth(12, alignment),
            valign,
            headerColor,
            headerOpacity
        },
        {
            label: "เช็คอิน\nเช็คเอ้าท์",
            property: 'date',
            width: getColumnWidth(12, alignment),
            valign,
            headerColor,
            headerOpacity
        },
        {
            label: "จำนวน",
            property: 'amount',
            width: getColumnWidth(9, alignment),
            valign,
            headerColor,
            headerOpacity,
            align: "center",
        },

        {
            label: "ค่าเสียหาย",
            property: 'damages',
            width: getColumnWidth(10, alignment),
            valign, headerColor,
            headerOpacity,
            align: "right",
        }, {
            label: "ยอดที่ชำระ",
            property: 'paid',
            width: getColumnWidth(10, alignment),
            valign, headerColor,
            headerOpacity,
            align: "right",
        },
        {
            label: "ยอดค่าเช่า",
            property: 'total',
            valign,
            width: getColumnWidth(10, alignment),
            headerColor,
            headerOpacity,
            align: "right",
        },

    ]
}


async function store(req, res) {
    try {
        const fontDir = path.join('src/font/sarabun/sarabun.ttf')
        const sarabunBoldDir = path.join('src/font/sarabun/Sarabun-Bold.ttf')
        const checkin = req.query.checkin
        const checkout = req.query.checkout
        const rental_type = req.query.rental_type


        let date_stamp = rental_type == 'monthly'
            ? getDateStampisMonthlyQuery(checkin, checkout)
            : getDateStampisDailyQuery(checkin, checkout)

        let sql = `SELECT booking_id,total,damages,fname,status,paid,`
        sql += `lname,room_number_id,checkin,checkout,status,unit_time,`
        sql += `time_count,date_stamp,rental_type FROM room_booking `
        sql += ` WHERE rental_type='${rental_type}'  AND ( `

        date_stamp.forEach((t, idx) => {
            sql += ` date_stamp LIKE '%${t}%'`
            if (idx < date_stamp.length - 1) sql += ' OR '
        })

        sql += `)`

        const roomsData = await db(`SELECT room_id,room_sub FROM rooms `)
        roomsData.map((r) => {
            const sub = JSON.parse(r.room_sub)
            r.room_sub = sub
            return r
        })
        const buildingData = await db(`SELECT * FROM building `)
        let reportList = []
        let damagesTotal = 0
        let total = 0
        let paid = 0
        const reportData = await db(sql)
        reportData.forEach((r) => {
            let room_number = ''
            let building_floor = ''
            let building = ''
            roomsData.forEach((s) => {
                const findIdx = s.room_sub.findIndex((d) => d.room_number_id == r.room_number_id)
                if (findIdx >= 0) {
                    room_number = s.room_sub[findIdx].room_number
                    building_floor = s.room_sub[findIdx].building_floor
                    const building_id = s.room_sub[findIdx].building
                    const hasBuilding = buildingData.findIndex((b) => b.building_id == building_id)
                    if (hasBuilding >= 0) building = buildingData[hasBuilding]
                }
            })
            total += r.total
            paid += r.paid
            damagesTotal += r.damages
            let data = {
                'booking_id': { label: `${r.booking_id}`, color: '#9E9E9E', },
                'room_number': { label: `${building.building_name} ชั้น ${building_floor}\nห้อง ${room_number} ` },
                'name': `${r.fname}\n${r.lname}`,
                'date': `${r.checkin}\n${r.checkout}`,
                'amount': `${r.time_count} ${getUnitTimeDisplay(r.unit_time)}`,
                'damages': getNumberFormat(r.damages),
                'paid': getNumberFormat(r.paid),
                'total': getNumberFormat(r.total),
            }
            reportList.push(data)
        })

        reportList.push({
            'booking_id': { label: 'รวม', fontSize: 12 },
            'room_number': ``,
            'name': ``,
            'date': ``,
            'amount': ``,
            'damages': { label: `bold:${getNumberFormat(damagesTotal)}`, fontSize: 12 },
            'paid': { label: `bold:${getNumberFormat(paid)}`, fontSize: 12 },
            'total': { label: `bold:${getNumberFormat(total)}`, fontSize: 12 },
        })
        const title = `รายงานการจองและการเช่าพักแบบ${getRentalTypeDisplay(rental_type)}`
        const checkinString = getDateisShortThai(checkin)
        const checkoutString = getDateisShortThai(checkout)
        const subtitle = `ตั้งแต่วันที่ ${checkinString} ถึง วันที่ ${checkoutString} (หากเป็นรายเดือนนับทั้งเดือนตามช่วงเวลาที่ค้นหา)`


        const table = {
            title: { label: title, fontSize: 14, fontFamily: sarabunBoldDir },
            subtitle: { label: subtitle, fontSize: 12, fontFamily: fontDir },
            headers: getReportTableHeaders(req.query.alignment),
            datas: reportList
        };

        let shop_logo_path = ''
        let locationString = ''
        const { company, logo, location, email, contact_number, } = req.query
        const alignment = req.query.alignment == 'horizontal' ? 'landscape' : 'portrait'
        const companyInfoField = getCompanyField()
        const companyInfo = await db(`SELECT * FROM contact WHERE name='${companyInfoField}'`)
        const companyInfoCount = companyInfo.length
        let companyInfoData = companyInfo.length > 0 ? JSON.parse(companyInfo[0].data) : {}

        if (companyInfoCount > 0) {
            shop_logo_path = `src/img/logo/${companyInfoData.shop_logo}`
            locationString += `${companyInfoData.location} `
            locationString += `${companyInfoData.road_alley}\n`
            locationString += `ต. ${companyInfoData.sub_district} `
            locationString += `อ. ${companyInfoData.district} `
            locationString += `จ. ${companyInfoData.province} `
            locationString += `${companyInfoData.postcode}`
        }
        const has_shop_logo = fs.existsSync(shop_logo_path)
        const doc = new PDFDocument({ size: 'A4', margin: 30, layout: alignment })

        doc.registerFont('Sarabun', fontDir);
        doc.registerFont('Sarabun Bold', sarabunBoldDir);
        doc.font('Sarabun')

        if (has_shop_logo && logo == 'true') doc.image(shop_logo_path, { width: 40 })
        if (companyInfoCount > 0 && company == 'true') doc.text(companyInfoData.company)
        if (companyInfoCount > 0 && location == 'true') doc.text(locationString, { align: 'right' })
        if (companyInfoCount > 0 && contact_number == 'true') doc.text(`โทร ${companyInfoData.contact_number}`, { align: 'right' })
        if (companyInfoCount > 0 && email == 'true') doc.text(`อีเมล ${companyInfoData.email}`, { align: 'right' })

        doc.table(table, {
            padding: 5,
            prepareHeader: () => doc.font("Sarabun Bold").fontSize(11),
            prepareRow: (row, indexColumn, indexRow, rectRow, rectCell) => doc.font("Sarabun").fontSize(10)
        });

        const damagesFormat = `${getNumberFormat(damagesTotal)}`
        const damagesThaiFormat = `( ${currencyThaiFormat(damagesTotal)} )`
        const totalFormat = `${getNumberFormat(total)}`
        const totalThaiFormat = `( ${currencyThaiFormat(total)} )`
        const paidFormat = `${getNumberFormat(paid)}`
        const paidThaiFormat = `( ${currencyThaiFormat(paid)} )`
        const createText = `สร้างวันที่ ${getDateTimeisThaiByDateTime(getCountFullDate().timestamp, 'long')}`
        const noteText = `หมายเหตุ การนับยอดรวมนับจากยอดที่ชำระเงินแล้ว`

        doc.font('Sarabun Bold').fontSize(12).text(`ยอดรวมทั้งสิ้น`, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(totalFormat, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(totalThaiFormat, { align: 'right' })
        doc.font('Sarabun Bold').fontSize(12).text(`ยอดชำระทั้งสิ้น`, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(paidFormat, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(paidThaiFormat, { align: 'right' })
        doc.font('Sarabun Bold').fontSize(12).text(`รวมค่าเสียหายทั้งสิ้น`, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(damagesFormat, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(damagesThaiFormat, { align: 'right' })
        doc.font('Sarabun').fontSize(12).text(createText, { align: 'right' })
        doc.font('Sarabun Bold').fontSize(12).text(noteText, { align: 'right' })

        const s = checkin.replaceAll('-', '')
        const e = checkout.replaceAll('-', '')
        const t = rental_type.substring(0, 1).toUpperCase()
        const cr = getCountFullDate().r
        const pdfFileName = `${cr}RS${s}E${e}${t}.pdf`
        const dir = path.join(`src/pdf/${pdfFileName}`)

        doc.pipe(fs.createWriteStream(dir));
        doc.end();
        res.send({ 'result': true, 'path': dir })
    } catch (err) {
        res.send({ 'result': false, 'err': err.message })
    }

}


async function receiptById(req, res,) {
    try {
        const id = req.params.id
        const wat = req.query.wat == 'true'
        const elc = req.query.elc == 'true'

        console.log(wat, elc)
        const sql = "SELECT * FROM room_booking WHERE booking_id=?"
        const bookingData = await db(`SELECT * FROM room_booking WHERE booking_id='${id}'`)
        const room_id = bookingData[0].room_id
        const room_number_id = bookingData[0].room_number_id
        const roomData = await db(`SELECT room_id,room_sub FROM rooms WHERE room_id='${room_id}'`)
        const room_sub = JSON.parse(roomData[0].room_sub)
        const room = room_sub.filter((r) => r.room_number_id == room_number_id)
        let room_number = ''
        let buiding_id = ''
        let building_floor = ''
        let building_name = ''
        let electricity_user_number = ''
        let water_user_number = ''


        const {
            company, logo, location, email,
            contact_number, customer_tax_id,
            customer_name,
            customer_address,
        } = req.query

        const isCustomerTax = customer_tax_id != '' && customer_name != '' && customer_address != ''
        const companyInfo = await db(`SELECT * FROM contact WHERE name='company_info'`)

        console.log(req.query)
        if (companyInfo.length > 0) companyInfo[0].data = JSON.parse(companyInfo[0].data)
        if (bookingData.length > 0) {
            // bookingData[0].checkin = getDateisShortThai(bookingData[0].checkin)
            // bookingData[0].checkout = getDateisShortThai(bookingData[0].checkout)
            bookingData[0].rental_type = getRentalTypeDisplay(bookingData[0].rental_type)
            bookingData[0].total = getNumberFormat(bookingData[0].total)
            bookingData[0].damages = getNumberFormat(bookingData[0].damages)
            bookingData[0].unit_time = getUnitTimeDisplay(bookingData[0].unit_time)
        }


        if (room.length > 0) {
            room_number = room[0].room_number
            buiding_id = room[0].building
            building_floor = room[0].building_floor
            electricity_user_number = room[0].electricity_user_number
            water_user_number = room[0].water_user_number
        }

        let watbill_paid = 0
        let watbill_total = 0
        let watbill_overdue = 0
        let elcbill_paid = 0
        let elcbill_total = 0
        let elcbill_overdue = 0
        const building = await db(`SELECT * FROM building WHERE building_id='${buiding_id}'`)
        if (building.length > 0) building_name = building[0].building_name
        let electricity_bill = []
        let water_bill = []

        const data = {
            'booking': bookingData,
            room_number,
            building_floor,
            building_name,
            'additional_cost': {},
            'company_info': companyInfo,
            company, logo, location, email, contact_number,
            customer_tax_id,
            customer_name,
            customer_address,
            'is_customer_tax': isCustomerTax
        }

        if (wat || elc) {
            const additionalcostData = await db(`SELECT * FROM additional_cost WHERE booking_id='${id}'`)
            if (additionalcostData.length > 0) {
                const transaction = JSON.parse(additionalcostData[0].transaction)
                    .map((r) => {
                        Object.assign(r, {
                            'display_type': r.type == 'wat' ? 'ค่าน้ำประปา' : 'ค่าไฟฟ้า',
                            'display_status': r.status == 'paid' ? 'ชำระแล้ว' : 'ค้างชำระ',
                            'total_format': getNumberFormat(r.total),
                            'paid_format': getNumberFormat(r.paid),
                            'overdue_format': getNumberFormat(r.overdue)
                        })
                        return r
                    })
                electricity_bill = transaction.filter((d) => { if (d.type == 'elc') return d })
                water_bill = transaction.filter((d) => { if (d.type == 'wat') return d })

                watbill_total = water_bill.map((r) => parseFloat(r.total)).reduce((prev, current) => prev + current, 0)
                watbill_paid = water_bill.map((r) => parseFloat(r.paid)).reduce((prev, current) => prev + current, 0)
                watbill_overdue = water_bill.map((r) => parseFloat(r.overdue)).reduce((prev, current) => prev + current, 0)

                elcbill_total = electricity_bill.map((r) => parseFloat(r.total)).reduce((prev, current) => prev + current, 0)
                elcbill_paid = electricity_bill.map((r) => parseFloat(r.paid)).reduce((prev, current) => prev + current, 0)
                elcbill_overdue = electricity_bill.map((r) => parseFloat(r.overdue)).reduce((prev, current) => prev + current, 0)

            }
        }


        if (wat) {
            Object.assign(data.additional_cost, {
                'water_bill': {
                    water_user_number,
                    'data': water_bill,
                    'watbill_overdue': getNumberFormat(watbill_overdue),
                    'watbill_total': getNumberFormat(watbill_total),
                    'watbill_paid': getNumberFormat(watbill_paid)
                }
            })
        }

        if (elc) {
            Object.assign(data.additional_cost, {
                'electricity_bill': {
                    electricity_user_number,
                    'data': electricity_bill,
                    'elcbill_overdue': getNumberFormat(elcbill_overdue),
                    'elcbill_paid': getNumberFormat(elcbill_paid),
                    'elcbill_total': getNumberFormat(elcbill_total)
                }
            })
        }

        res.render('admin/report/receipt', data)
    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }


    // Object.assign(responseObject, )



}

async function getReportView(req, res) {
    try {
        const reportData = await getReportData(req, res)
        const rental_type = req.query.rental_type
        const checkin = getDateisFullThai(req.query.checkin)
        const checkout = getDateisFullThai(req.query.checkout)

        const { company, logo, location, email, contact_number, } = req.query
        const companyInfo = await db(`SELECT * FROM contact WHERE name='company_info'`)

        if (companyInfo.length > 0) companyInfo[0].data = JSON.parse(companyInfo[0].data)

        res.render('admin/report/report_view',
            {
                'entries': reportData,
                'company_info': companyInfo,
                rental_type,
                rental_title: getRentalTypeDisplay(rental_type),
                checkin, checkout,
                company, logo, location, email, contact_number
            })
    } catch (err) {
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }

}
module.exports.ReportController = { store, receiptById, getReportView, }