const express = require('express')
const { RoomController } = require('../controllers/roomController')
const router = express.Router()
const multer = require('multer')
const { storage, logo_storage, qrcode_storage, slide_storage, profile_storage, slip_payment_storage, aboutRoom_storage, shop_logo_storage, font_storage } = require('../modules/multer')
const upload_logo = multer({ storage: logo_storage })
const upload = multer({ storage: storage })
const upload_qrcode = multer({ storage: qrcode_storage })
const upload_siide = multer({ storage: slide_storage })
const upload_profile = multer({ storage: profile_storage })
const upload_slip_payment = multer({ storage: slip_payment_storage })
const upload_aboutRoom_img = multer({ storage: aboutRoom_storage })
const upload_shop_logo = multer({ storage: shop_logo_storage })
const upload_font = multer({ storage: font_storage })

const { BuildingController } = require('../controllers/buildingController')
const { BookingController } = require('../controllers/bookingController')
const { AdditionalCostController } = require('../controllers/additionalCostsController')
const { OffocerController } = require('../controllers/officerController')

const { SocialController } = require('../controllers/socialController')
const { MetaController } = require('../controllers/metaController')
const { LogoController } = require('../controllers/logoController')
const { PaymentController } = require('../controllers/paymentController')
const { SlideController } = require('../controllers/slideController')
const { RoomAboutController } = require('../controllers/roomAboutController')
const { AboutController } = require('../controllers/aboutController')
const { WebController } = require('../controllers/webController')
const { MemberController } = require('../controllers/memberController')
const { ReportController } = require('../controllers/reportController')
const { PromotionController } = require('../controllers/promotionController')
const { SystemController } = require('../controllers/systemConfigController')
const { PDFController } = require('../controllers/pdfController')





router.get('/', WebController.home)
router.get('/room/:room_id/:room_number', WebController.getDataByRoomId)
router.get('/reserve', WebController.store)
router.get('/reserve_r/:room_id/:room_number_id/:room_number', WebController.booking)
router.get('/register', WebController.register)
router.get('/login', WebController.login)
router.get('/history', WebController.history)
router.get('/about', WebController.about)
router.get('/booking/payment/:id', WebController.payment)
router.get('/booking/:id', WebController.getDataById)
router.get('/about/room/other', WebController.getRoomAboutDataAll)
router.get('/room', WebController.getRoomDataAll)



router.get('/member', WebController.member)
router.put('/member/update/:username', MemberController.update)
router.put('/member/update/password', MemberController.change_password)
router.get('/member/logout', WebController.logout)
router.post('/member/auth', MemberController.auth)
router.post('/member/insert', MemberController.insert)
router.post('/member/login', MemberController.login)
router.get('/member/data/:id', MemberController.getDataById)
router.post('/member/auth/password', MemberController.auth_password)



router.post('/room/auth/duplicate', RoomController.auth)
router.get('/room/add', RoomController.add)
router.post('/room/insert', upload.fields([{ name: 'example', maxCount: 5 }]), RoomController.insert)
router.get('/room/edit', RoomController.edit)
router.put('/room/update/:id', upload.fields([{ name: 'example', maxCount: 5 }]), RoomController.update)
router.delete('/room/delete/:id', RoomController.soft_delete)
router.get('/api/room/:id', RoomController.getRoomById)
router.get('/api/room/number/:id', RoomController.getRoomNumberById)
router.get('/room/all', RoomController.store)
router.get('/room/info/data/:id', RoomController.getRoomDataById)

router.get('/social/create', SocialController.create)
router.post('/social/update', SocialController.update)
router.patch('/social/switchSocial', SocialController.switchSocial)
router.get('/api/social', SocialController.store)


router.get('/meta/add', MetaController.add)
router.post('/meta/insert', MetaController.insert)
router.get('/meta/edit/:id', MetaController.edit)
router.put('/meta/update/:id', MetaController.update)
router.post('/api/meta', MetaController.store)
router.delete('/meta/delete/:id', MetaController.soft_delete)

router.post('/logo/create', upload_logo.fields([{
    'name': 'logo', maxCount: 1
}, {
    'name': 'icon', maxCount: 1
}]), LogoController.logo)

router.post('/logo/insert', upload_logo.fields([{
    'name': 'logo', maxCount: 1
}, {
    'name': 'icon', maxCount: 1
}]), LogoController.insert)

router.post('/icon/create', upload_logo.fields([{
    'name': 'logo', maxCount: 1
}, {
    'name': 'icon', maxCount: 1
}]), LogoController.icon)

router.post('/title/create', LogoController.title)
router.post('/api/icon', LogoController.store)


router.get('/api/building', BuildingController.store)
router.get('/api/building/edit/:id', BuildingController.createBuildingById)
router.get('/api/building/:id', BuildingController.createBuildingById)
router.get('/api/buildingFloor/:id', BuildingController.buildingFloor)
router.post('/building/insert', BuildingController.insert)
router.put('/building/update/:id', BuildingController.update)
router.delete('/building/delete/:id', BuildingController.buidingDelete)



router.post('/payment/insert', PaymentController.insert)
router.get('/payment/edit/:id', PaymentController.edit)
router.put('/payment/update/:id', PaymentController.update)
router.delete('/payment/delete/:id', PaymentController.paymentDelete)
router.patch('/payment/switch/:id', PaymentController.paymentSwitch)
router.post('/api/bank-transfer', PaymentController.store)
router.put('/payment/edit', PaymentController.update)

router.post('/qrcode/create', upload_qrcode.single('qrcode'), PaymentController.qrcodeCreate)


router.post('/slide/insert', upload_siide.single('slide'), SlideController.insert)
router.delete('/slide/delete/:id', SlideController.slideDelete)
router.patch('/slide/title/:id', SlideController.title)
router.patch('/slide/descript/:id', SlideController.descript)
router.patch('/slide/status/:id', SlideController.status)
router.post('/api/slide', SlideController.store)



router.post('/about/insert', upload_aboutRoom_img.single('img'), RoomAboutController.insert)
router.put('/about/update/:id', upload_aboutRoom_img.single('img'), RoomAboutController.update)
router.delete('/about/delete/:id', RoomAboutController.aboutDelete)
router.put('/about/status/:id', RoomAboutController.status)
router.post('/about/contact/save', upload_shop_logo.single('shop_logo'), AboutController.save)
router.post('/api/about', RoomAboutController.about)
router.get('/about/:id', RoomAboutController.getDataById)



// router.post('/admin/insert', upload_profile.single('profile'), EmployeeController.insert)
// router.post('/admin/update', upload_profile.single('profile'), EmployeeController.update)
// router.post('/admin/delete', EmployeeController.adminDelete)


router.patch('/booking/cancel/:id', BookingController.checkinConfirm)
router.patch('/booking/confirm/:id', BookingController.confirm)
router.post('/booking/cancel', BookingController.cancel)
router.get('/booking/report/:id', BookingController.report)
router.get('/booking/data/:id', BookingController.getDataById)
router.get('/booking/room/data/:id', BookingController.getBookingDataAndRoomDataById)
router.get('/booking/transaction/:id/:date', BookingController.getTransactionByDateAndId)
router.patch('/booking/monthly/paymore/:id', BookingController.payMore)
router.patch('/booking/checkout/:id', BookingController.checkout)
router.patch('/booking/checkin/confirm/:id', BookingController.checkinConfirm)
// router.patch('/booking/checkin/cancel/:id', BookingController.checkinConfirm)
router.get('/booking/calendar/:id', BookingController.calendar)
router.post('/booking/insert', BookingController.insert)
router.put('/booking/update/:id', BookingController.update)
router.patch('/booking/addime/:id', BookingController.addTime)
router.get('/api/booking/reservations/:date', BookingController.getDataByDate)
router.post('/booking/member/insert', BookingController.bookingByMember)
router.patch('/booking/statement/:id', upload_slip_payment.single('slip_payment'), BookingController.slip_payment)
router.get('/booking/checkin/:id', BookingController.getDataByCheckin)
router.get('/booking/data/room/:room_id/:room_number_id', BookingController.getDataByRoomIdAndRoomNumberId)
router.post('/booking/isvalid/:room_id', BookingController.isValidBooking)
router.post('/booking/continous/insert', BookingController.continous_booking)

router.get('/report/booking', ReportController.store)
router.get('/admin/receipt/:id', ReportController.receiptById)
router.get('/admin/report/view', ReportController.getReportView)
// router.post('/booking/create', upload_slip_payment.single('slip_payment'), BookingController.create)



router.get('/additionalcost/:id', AdditionalCostController.getDataById)
router.post('/additionalcost/insert', AdditionalCostController.insert)
router.put('/additionalcost/update/:id', AdditionalCostController.update)
router.patch('/additionalcost/transaction/update/:id', AdditionalCostController.transactionUpdate)
router.get('/additionalcost/transaction/data/:id/:date/:type', AdditionalCostController.getTransactionById)
router.delete('/additionalcost/delete/:id', AdditionalCostController.soft_delete)
router.patch('/additionalcost/transaction/delete/:id', AdditionalCostController.transactionDelete)

router.post('/officer/user/auth', OffocerController.auth)
router.post('/officer/user/insert', OffocerController.insert)
router.put('/officer/user/update/:id', OffocerController.update)
router.patch('/officer/user/role/:id', OffocerController.roleUpdate)
router.get('/officer/user/data/:id', OffocerController.getDataById)

router.post('/promotion/insert', PromotionController.insert)
router.get('/promotion/:id', PromotionController.getDataById)
router.put('/promotion/update/:id', PromotionController.update)
router.delete('/promotion/delete/:id', PromotionController.soft_delete)

router.post('/system/font/insert', upload_font.single('font_upload'), SystemController.insert)
router.get('/system/font/data', SystemController.getFontAll)
router.post('/system/config/create', SystemController.config_system)
router.get('/system/font/:id', SystemController.getDataById)
router.put('/system/font/update/:id', upload_font.single('font_upload'), SystemController.update)
router.delete('/system/font/delete/:id', SystemController.deleteById)

router.post('/pdf/delete', PDFController._delete)

module.exports.routes = router