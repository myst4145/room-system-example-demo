const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const session = require('express-session')
const mysql = require('mysql2/promise')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const bcrypt = require('bcrypt');
require('dotenv').config()
const mysql2 = require('mysql2')
const { display } = require('./src/js/display')
const configAdmin = {
    'username': process.env.CONFIG_ADMIN_USER,
    'password': process.env.CONFIG_ADMIN_PASSWOED,
    'role': process.env.CONFIG_ROLE,
    'fname': process.env.CONFIG_FNAME,
    'data_role': JSON.stringify([]),
}
const condb = mysql2.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    database: process.env.MYSQL_DB,
    port: process.env.MYSQL_PORT,
    password: process.env.MYSQL_PASSWORD
})
const { db } = require('./src/js/function')
const notfoundPage = 'errNotfound'
const threeMinutes = 1000 * 30 * 30


app.use(
    session({
        resave: true,
        secret: '123456',
        saveUninitialized: true,
        cookie: { maxAge: threeMinutes }
    }));

app.set('view engine', 'ejs')
app.use('/js', express.static(path.join(__dirname, 'src/js')))
app.use('/css', express.static(path.join(__dirname, 'src/css')))
app.use('/src', express.static(path.join(__dirname, 'src')))
app.use('/admin', express.static(path.join(__dirname, 'views/admin')))
app.use('/axios', express.static(path.join(__dirname, 'node_modules/axios/dist/axios.min.js')))
app.use('/chartJS', express.static(path.join(__dirname, 'node_modules/chart.js/dist/')))
app.use('/font', express.static(path.join(__dirname, 'src/fonts')))
app.use('/bootstrap', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/')))
app.use('/sweetalert2', express.static(path.join(__dirname, 'node_modules/sweetalert2/dist/')))
app.use('/bootstrap-icons', express.static(path.join(__dirname, 'node_modules/bootstrap-icons/font/')))
app.use('/Foundation-Sites', express.static(path.join(__dirname, 'src/css/Foundation-Sites-CSS/')))
app.use('/bootstrap4.6', express.static(path.join(__dirname, 'src/css/bootstrap-4.6.2/dist/')))
app.use('/fontawesome', express.static(path.join(__dirname, 'src/fontawesome-6.4.2/')))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cookieParser())

condb.connect((err) => {
    if (err) {
        console.log(err)
    }
})



app.post('/api/togglebar', async (req, res) => {
    const result = await addToggleBarSession(req)
    if (result) {
        res.send({ 'result': true })
    }
    if (!result) {
        res.send({ 'result': false })
    }
})






async function addToggleBarSession(req) {
    req.session.toggle_bar = await req.body.toggle_bar
    const session = await fetchSession(req)
    return session.toggle_bar != undefined ? true : false
}
async function fetchSession(req) {
    return await req.session
}

async function clearSessionAndSignOut(req) {
    const session = await fetchSession(req)
    session.admin = undefined
    session.admin_role = undefined
    session.admin_fname = undefined
    session.role = undefined
    session.data_role = undefined
    session.officer_id = undefined
    await req.session.destroy
    const {
        admin,
        admin_role,
        admin_fname,
    } = await fetchSession(req)

    return (admin && admin_role && admin_fname) == undefined ? true : false
}
app.get('/booking-receipt/:id', (req, res) => {
    const sql = `SELECT * FROM room_booking WHERE booking_id='${req.params.id}'`
    condb.query(sql, (err, result, fields) => {
        if (err) {
            res.render(notfoundPage, {
                'msg': err,
                'err_no': err.errno
            })
        }
        if (!err) {
            result.map((r) => {
                r.unit_times = display.unitTimes(r.unit_times)
            })
            res.render('admin/booking_report_receipt', {
                'entries': result
            })
        }
    })
})

async function getDataRoleById(id) {
    try {
        console.log('id : ', id)
        const data = await db(`SELECT officer_id,data_role FROM officer WHERE officer_id='${id}'`)
        console.log('data', data)
        if (data.length > 0) {
            return JSON.parse(data[0].data_role)
        } else {
            return []
        }
    } catch (error) {
        console.log(error)
        return []
    }

}




// admin Route สำหรับผู้่ดูแลระบบหลังบ้่าน
app.get('/system', async (req, res, next) => {

    try {
        let responseObject = {}
        const session = await fetchSession(req)
        const adminSession = session.admin
        const statusbar = session.toggle_bar != undefined ? session.toggle_bar : 'on'
        if (!adminSession) res.render('admin/signin')


        let p = req.query.p != undefined ? req.query.p : '/'
        const has_page = system_menu.findIndex((m) => m.p == p)
        if (has_page < 0) res.redirect('/system')

        const page = has_page >= 0 ? p : '/'
        const template = getSystemMenuTemplate(page).template
        const pageTitle = getSystemMenuTemplate(page).title
        const pageRender = 'admin/index'
        const data_role_obj = await getDataRoleById(session.officer_id)
        const data_role = setRole(data_role_obj)
        const fonts = await getSystemFont()
        console.log(fonts)
        Object.assign(responseObject, { 'page_title': pageTitle })
        Object.assign(responseObject, { 'togglebar': statusbar })
        Object.assign(responseObject, { 'admin': session.admin })
        Object.assign(responseObject, { 'admin_role': session.admin_role })
        Object.assign(responseObject, { 'admin_fname': session.admin_fname })
        Object.assign(responseObject, { 'data_role': data_role })
        Object.assign(responseObject, { 'officer_id': session.officer_id })
        Object.assign(responseObject, { 'template': template })
        Object.assign(responseObject, { 'fonts': fonts })

        const is_role = systemRole(page, session.admin_role, data_role)
        if (!is_role) res.redirect('system')
        switch (page) {
            case '/':
                SystemController.home(req, res, responseObject, pageRender)
                break
            case 'dashboard':
                dashboard(req, res, responseObject, pageRender)
                break
            case 'booking_report':
                BookingController.bookingReport(req, res, responseObject, pageRender)
                break

            case 'building':
                BuildingController.index(req, res, responseObject, pageRender)
                break
            case 'building-edit':
                BuildingController.edit(req, res, responseObject, pageRender)
                break
            case 'social_contact':
                SocialController.create(req, res, responseObject, pageRender)
                break
            case 'admin-insert':
                res.render(pageRender, responseObject)
                break
            case 'user-admin':
                userAdminPage(req, res, responseObject, pageRender)
                break
            case 'admin-edit':
                adminEditPage(req, res, responseObject, pageRender)
                break

            case 'rm_ins':
                RoomController.add(req, res, responseObject, pageRender)
                break
            case 'rm_m':
                RoomController.manage(req, res, responseObject, pageRender)
                break
            case 'rm_edit':
                RoomController.edit(req, res, responseObject, pageRender)
                break
            case 'resting':
                BookingController.restingPage(req, res, responseObject, pageRender)
                break
            case 'checkout':
                BookingController.checkoutPage(req, res, responseObject, pageRender)
                break

            case 'booking_room':
                BookingController.getBookingByRoom(req, res, responseObject, pageRender)
                break
            case 'rental_m':
                BookingController.rentalManage(req, res, responseObject, pageRender)
                break
            case 'rental_mly':
                BookingController.rentalMonthly(req, res, responseObject, pageRender)
                break
            case 'rental_dly':
                BookingController.rentalDaily(req, res, responseObject, pageRender)
                break
            case 'rental_edit':
                BookingController.edit(req, res, responseObject, pageRender)
                break


            case 'additional_m':
                AdditionalCostController.index(req, res, responseObject, pageRender)
                break

            case 'additional_transt':
                AdditionalCostController.transaction(req, res, responseObject, pageRender)
                break

            case 'officer_m':
                OffocerController.index(req, res, responseObject, pageRender)
                break
            case 'officer_role':
                OffocerController.role(req, res, responseObject, pageRender)
                break
            case 'profile':
                OffocerController.profile(req, res, responseObject, pageRender)
                break
            case 'company_contact':
                AboutController.webAboutaPage(req, res, responseObject, pageRender)
                break
            case 'logo':
                LogoController.create(req, res, responseObject, pageRender)
            case 'meta':
                MetaController.manage(req, res, responseObject, pageRender)
                break
            case 'room-about':
                RoomAboutController.manage(req, res, responseObject, pageRender)
                break
            case 'm_slide':
                SlideController.manage(req, res, responseObject, pageRender)
                break
            case 'payment':
                PaymentController.manage(req, res, responseObject, pageRender)
                break
            case 'qrcode':
                PaymentController.qrcode(req, res, responseObject, pageRender)
                break
            case 'social-contact':
                SocialController.create(req, res, responseObject, pageRender)
                break
            case 'daily':
                BookingController.daily(req, res, responseObject, pageRender)
                break
            case 'checkin':
                BookingController.checkin(req, res, responseObject, pageRender)
                break
            case 'cf_pay':
                BookingController.confirmPayment(req, res, responseObject, pageRender)
                break
            case 'promotion':
                PromotionController.index(req, res, responseObject, pageRender)
                break
            case 'sys_font':
                SystemController.config_font(req, res, responseObject, pageRender)
                break
            case 'sys_config':
                SystemController.index(req, res, responseObject, pageRender)
                break
            case 'pdf':
                PDFController.store(req, res, responseObject, pageRender)
                break
            case 'member':
                MemberController.index(req, res, responseObject, pageRender)
                break
            case 'notFound':
                res.render(notfoundPage, {
                    'msg': 'Not FoundPage',
                    'err_no': '404'
                })
            default:
                res.render(notfoundPage, {
                    'msg': 'Not FoundPage',
                    'err_no': '404'
                })
                break
        }

    } catch (err) {
        console.log(err)
        res.render(notfoundPage, {
            'msg': err,
            'err_no': err.errno
        })
    }



})

// สำหรับ fetch และ บันทึกข้อมูล




const { BuildingController } = require('./controllers/buildingController')
const { RoomController } = require('./controllers/roomController')
const { BookingController } = require('./controllers/bookingController')
const { routes } = require('./routes/routes')


const { AdditionalCostController } = require('./controllers/additionalCostsController')
const { OffocerController } = require('./controllers/officerController')
const { AboutController } = require('./controllers/aboutController')
const { LogoController } = require('./controllers/logoController')
const { RoomAboutController } = require('./controllers/roomAboutController')
const { SlideController } = require('./controllers/slideController')
const { PaymentController } = require('./controllers/paymentController')
const { SocialController } = require('./controllers/socialController')
const { MetaController } = require('./controllers/metaController')
const { PromotionController } = require('./controllers/promotionController')
const { getSystemMenuTemplate } = require('./modules/systems/getSystemMenuTemplate')
const { SystemController } = require('./controllers/systemConfigController')
const { getSystemConfigField } = require('./modules/getFieldName')
const systemRole = require('./modules/systems/systemRole')
const setRole = require('./modules/systems/setRole')
const { errPage } = require('./modules/errPage')
const { system_menu } = require('./modules/systems/systemMenu')
const { getSystemFont } = require('./modules/systems/getSystemFont')
const { PDFController } = require('./controllers/pdfController')
const { MemberController } = require('./controllers/memberController')






app.use(routes)














app.get('/api/preview-room', (req, res) => {
    condb.query("SELECT * FROM rooms ", (err, result, fields) => {
        if (err) {
            res.send({ 'result': false, 'err': err.message })
        }
        if (!err) {
            res.send({ 'result': true, 'entries': result })
            console.log(result)
        }
    })
})

app.post('/api/room', async (req, res) => {
    condb.query("SELECT  * FROM rooms ORDER BY modified DESC", async (error, results, fields) => {
        if (error) {
            res.send({ 'result': false, 'err': error.message })
        }
        if (!error) {
            let rooms = []
            results.forEach((r) => {
                const room_sub = JSON.parse(r.room_sub)
                const { room_id,
                    room_type,
                    bed_type,
                    roomview,
                    special_options,
                    bathtup,
                    bathroom,
                    smoking,
                    detail,
                    data_price,
                    example_room,
                    created,
                    modified } = r
                room_sub.forEach((e) => {

                    const { room_number, building, building_floor, status } = e
                    console.log(status)
                    const data = {
                        room_number, building, building_floor, status,
                        room_id,
                        room_type,
                        bed_type,
                        roomview,
                        special_options,
                        bathtup,
                        bathroom,
                        smoking,
                        detail,
                        data_price,
                        example_room,
                        created,
                        modified
                    }

                    if (status == 'empty') {
                        rooms.push(data)
                    }
                })
                rooms = rooms.filter((v, i) => i < 5)
            })
            res.send(
                { 'result': true, 'entries': rooms }

            )
        }
    })
})


async function signinAdmin(data) {
    let result = []
    const { username, password } = data
    const sql = `SELECT * FROM officer WHERE username='${username}'`
    const rows = await db(sql)
    if (rows.length == 0) {
        result = []
    }
    if (rows.length > 0) {
        await bcrypt.compare(password, rows[0].password).then(function (isLogin) {
            if (isLogin) {
                result = rows
            } else {
                result = []
            }
        });
    }
    return result
}

async function adminSession(req) {
    return await req.session.admin
}
async function addAdminSession(req, data) {
    req.session.admin = data.username
    req.session.admin_role = data.role
    req.session.admin_fname = data.officer_fname
    req.session.data_role = data.data_role,
        req.session.officer_id = data.officer_id
    const {
        admin,
        admin_role,
        admin_fname,
        data_role,
        officer_id
    } = await req.session

    return admin && admin_role && admin_fname && data_role && officer_id ? { 'result': true } : { 'result': false }
}
app.post('/api/sign-in', async (req, res) => {
    const admin_session = await adminSession(req)
    if (!admin_session) {
        const { username, password } = req.body
        if (configAdmin.username == username && configAdmin.password == password) {
            const signInResult = await addAdminSession(req, configAdmin)
            if (signInResult) {
                res.send({ 'result': true })
            } else {
                res.send({ 'result': false })
            }
        } else {
            const data = await signinAdmin(req.body)
            if (data.length == 0) {
                res.send({ 'result': false, 'msg': 'ไม่ผู้ใช้งานนี้ หรือ กรอกข้อมูล ผู้ใช้ หรือ รหัสผ่านไม่ถูกต้อง' })
            }

            if (data.length == 1) {
                const signInResult = await addAdminSession(req, data[0])
                if (signInResult) {
                    res.send({ 'result': true })
                } else {
                    res.send({ 'result': false })
                }
            }

        }
    }
})


app.post('/api/sign-out', async (req, res) => {

    const signOutResult = await clearSessionAndSignOut(req)
    if (signOutResult) {
        res.send({ 'result': true })
    }
    if (!signOutResult) {
        res.send({ 'result': false })
    }
})


app.listen(process.env.PORT, (err) => {
    if (err) {
        console.log(err)
    }
})