const multer = require('multer')
const path = require('path')
const { getCountFullDate } = require('../src/js/function')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let pathRename = ''
    if (file.fieldname == 'example') {
      pathRename = path.join('src/img/example_room')
    }
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    let pathRename = ''
    if (file.fieldname == 'example') {
      pathRename = 'example_'
    }

    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const getDt = getCountFullDate()
    const { r } = getCountFullDate()
    const n = `${pathRename}${r}_${uniqueSuffix}${fileType}`
    cb(null, n)
  }
})

const shop_logo_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/img/logo')
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.split('.')[1].trim()
    const n = `shop_logo.png`
    cb(null, n)
  }
})


const logo_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/img/logo/')
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    let pathRename = ''
    if (file.fieldname == 'logo') {
      pathRename = 'logo'
    } else if (file.fieldname == 'icon') {
      pathRename = 'icon'
    }

    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const getDt = getCountFullDate()
    const { r } = getCountFullDate()
    const n = `${pathRename}${fileType}`
    cb(null, n)
  }
})

const profile_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/profile')
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    let pathRename = 'p_'


    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const getDt = getCountFullDate()
    const { r } = getCountFullDate()
    const n = `${pathRename}${r}_${uniqueSuffix}${fileType}`
    cb(null, n)
  }
})


const aboutRoom_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/img/room_about/')
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const { r } = getCountFullDate()
    const n = `${r}${uniqueSuffix}${fileType}`
    cb(null, n)
  }
})

const slide_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/img/slide')
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const { r } = getCountFullDate()
    const n = `${r}${uniqueSuffix}${fileType}`
    cb(null, n)
  }
})

const qrcode_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/img/qrcode')
    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    const n = `qr${fileType}`
    cb(null, n)
  }
})




const slip_payment_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/img/slip_payment')

    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    let pathRename = 'slip_payment_'


    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const getDt = getCountFullDate()
    const { r } = getCountFullDate()
    const n = `${pathRename}${r}_${uniqueSuffix}${fileType}`
    cb(null, n)
  }
})

const font_storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const pathRename = path.join('src/font/customs')

    cb(null, pathRename)
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname
    const fileType = originalname.substring(originalname.lastIndexOf('.'))
    const uniqueSuffix = Math.round(Math.random() * 100000000)
    const { r } = getCountFullDate()
    const n = `${r}${uniqueSuffix}${fileType}`
    cb(null, n)
  }
})
module.exports = {
  slip_payment_storage,
  qrcode_storage,
  slide_storage,
  aboutRoom_storage,
  profile_storage,
  storage,
  logo_storage,
  shop_logo_storage,
  font_storage
}


