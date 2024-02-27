require('dotenv').config()
const { getCountDate } = require('./dateFunc');
const { display } = require('./display');
const {
  MYSQL_HOST,
  MYSQL_USERNAME,
  MYSQL_PASSWORD,
  MYSQL_PORT,
  MYSQL_DB } = process.env
async function db(sql, res) {
  const mysql = require('mysql2/promise');
  const conn = await mysql.createConnection({
    host: MYSQL_HOST,
    user: MYSQL_USERNAME,
    database: MYSQL_DB,
    port: MYSQL_PORT,
    password: MYSQL_PASSWORD
  });

  const [rows, fields, err] = await conn.execute(sql)

  await conn.end();
  return rows
}

async function totalList(sql) {
  const rooms = await db("SELECT * FROM rooms")
  const booking_total_list = await db(sql)
  let r_number_booking = []
  const rooms_number_list = []
  let r_number_all = []
  const booking_list = booking_total_list.map((r) => `${r.room_id},${r.room_number}`)

  rooms.forEach((r) => {
    const sub = JSON.parse(r.room_sub).map((sub) => {
      return `${r.room_id},${sub.room_number_id}`
    })

    rooms_number_list.push(...sub)
  })
  booking_list.forEach((n) => {
    if (!r_number_booking.includes(n)) {
      r_number_booking.push(n)
    }
  })

  rooms_number_list.forEach((r) => {
    if (!r_number_all.includes(r)) {
      r_number_all.push(r)
    }
  })
  booking_list.forEach((r) => {
    if (!r_number_all.includes((r))) {
      r_number_all.push(r)
    }
  })

  let room = await db(`SELECT * FROM rooms`)
  let n = []
  room.forEach((r) => {
    n.push(...JSON.parse(r.room_sub))
  })

  r_number_all = r_number_all.map((r) => {
    const [room_id, room_number] = r.split(',')
    const filter = n.filter((e) => e.room_number_id == room_number)
    const label = filter.length > 0 ? filter[0].room_number : 'ไม่มีห้องนี้'
    const building = filter.length > 0 ? filter[0].building : 'no'



    return {
      'room_id': room_id,
      'room_number': room_number,
      'room_number_label': label,
      building,
      'total': []
    }
  })


  const total_list = await db(sql)
  total_list.forEach((b) => {

    const index = r_number_all.findIndex((r) => {
      return b.room_id == r.room_id && b.room_number == r.room_number
    })

    if (index >= 0) {
      r_number_all[index].total.push(b.paid)
    }

  })

  const total_list_data = r_number_all.map((r) => {
    const total = r.total.map((d) => Number.parseFloat(d)).reduce((prev, curr) => {
      return prev + curr;
    }, 0);
    return {
      'building': r.building,
      'room_number_label': r.room_number_label,
      'room_number': r.room_number,
      'total': total,
      'count': r.total.length
    }
  })

  const sum_total = total_list_data
    .map((r) => Number.parseFloat(r.total))
    .reduce((prev, curr) => prev + curr, 0)

  const map_total_list = total_list_data
    .map((r, no) => {
      const avg = Number.parseFloat(r.total) * 100 / sum_total
      const avg_fixed = isNaN(avg) ? 0 : avg
      return {
        'room_number': r.room_number_label,
        'total': r.total,
        'total_format': display.setNumberFormat(r.total),
        'no': no + 1,
        'count': r.count,
        'building': r.building,
        'avg': avg_fixed.toFixed(2)
      }
    })
  return map_total_list
}

async function countTask(sql) {
  const d = await db(sql)
  return d.length
}
function endCheckOp(q) {
  return q.includes('AND') ? 'AND' : ''
}

function resDate(stamp) {
  const d = new Date(stamp)
  const dt = display.countDate(d.getDate())
  const m = display.countDate(d.getMonth() + 1)
  const y = d.getFullYear()
  return `${y}-${m}-${dt}`
}

function getCountFullDate() {
  const _date = new Date
  const y = _date.getFullYear()
  const m = getCountDate(_date.getMonth() + 1)
  const dt = getCountDate(_date.getDate())

  const hour = getCountDate(_date.getHours())
  const minutes = getCountDate(_date.getMinutes())
  const seconds = getCountDate(_date.getSeconds())
  const day = getCountDate(_date.getDay)

  const randomn = `${y}${m}${dt}${hour}${minutes}${seconds}`
  const timestamp = `${y}-${m}-${dt} ${hour}:${minutes}:${seconds}`
  return { 'timestamp': timestamp, 'r': randomn }
}

function createRandom() {
  return uniqueSuffix = Math.round(Math.random() * 100000)
}



function whereCheck(sql) {
  return sql.includes('WHERE') ? '' : ' WHERE '
}



module.exports = {
  whereCheck,
  createRandom,
  getCountFullDate,
  endCheckOp,
  totalList,
  db,
  countTask,
  resDate
}