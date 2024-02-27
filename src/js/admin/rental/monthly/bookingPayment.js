$('[name="booking-payment"]').click(function () {
    const id = $(this).data('id')
    axios.get(`/booking/data/${id}`)
        .then((response) => {
            const result = response.data.result
            if (!result) {
                queryFail('แจ้งเตือน', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
            if (result) {
                const entries = response.data.entries
                const transaction = JSON.parse(entries[0].transaction)

                if (transaction.length == 0) {
                    $('#rental-data').html(`<tr><td class="text-center" colspan="4">ไม่มีข้อมูล</td></tr>`)
                }
                const sum_transaction = transaction
                    .map((t) => parseFloat(t.paid))
                    .reduce((prev, current,) => prev + current, 0)


                let transactionTableEl = ''
                if (transaction.length > 0) {
                    transaction.forEach((t) => {

                        console.log(t)
                        const [y, m] = t.date.split('-')
                        const month = getThaiMonth(m)
                        const year = getFullYearThai(y)
                        const dateThai = `${month} ${year}`
                        const status = getTransactionPayAt(t.status)
                        const isDisabled = t.status == 'all' ? 'disabled' : ''
                        const textStatus = getTransactionPayAtText(t.status)
                        const icons = t.status == 'success' ? '<i class="fa-solid fa-circle-check"></i>' : ''

                        transactionTableEl += `<tr>`
                        transactionTableEl += `<td class="align-middle">`
                        transactionTableEl += `<p class="m-0 font-weight-bold">${dateThai}</p>`
                        transactionTableEl += `<p class="m-0">${t.date}</p>`
                        transactionTableEl += `</td>`
                        transactionTableEl += `<td class="text-right align-middle">`
                        transactionTableEl += `<input type="number" disabled class="form-control-plaintext text-right"  data-date="${t.date}" name="transction-paid-table" value="${t.paid}">`
                        transactionTableEl += `</td>`
                        transactionTableEl += `<td class="align-middle transaction-status" data-date="${t.date}">`
                        transactionTableEl += `<p class="m-0 font-weight-bold ${textStatus}">`
                        transactionTableEl += `${status}`
                        transactionTableEl += `</p>`
                        transactionTableEl += `</td>`
                        transactionTableEl += `<td class="align-middle">`
                        transactionTableEl += `<input type="text" disabled class="form-control-plaintext"  data-date="${t.date}" name="transction-payat" value="${t.pay_at}">`
                        transactionTableEl += `</td>`
                        transactionTableEl += `<td class="align-middle text-center">`
                        transactionTableEl += `<button data-date="${t.date}" name="transaction-pay" ${isDisabled} class="btn btn-sm bg-gradient-secondary" onclick="payMonthlyByDate('${t.date}','${id}')">ชำระ</button>`
                        transactionTableEl += `</td>`
                        transactionTableEl += `</tr>`
                    })
                    $('#transaction-table').html(transactionTableEl)
                }
                const {
                    booking_id,
                    room_id,
                    room_number_id,
                    amount_people_stay,
                    checkin,
                    checkout,
                    over_people_type,
                    payment_type,
                    emp_id
                } = entries[0]
                const created = getFullDateTimeisThaiByDateTime(entries[0].created)
                const rentaltype = getRentalTypeDisplay(entries[0].rental_type)
                const count = `${entries[0].time_count} ${getUnitTimeDisplay(entries[0].unit_time)}`
                const name = `${entries[0].fname} ${entries[0].lname}`
                const phone = getNumberPhoneDisplay(entries[0].phone)
                const total = getNumberFormat(entries[0].total)
                const paid = getNumberFormat(entries[0].paid)
                const deposit = getNumberFormat(entries[0].deposit)
                console.log(entries[0].rental_type)
                const data = {
                    'เลขที่จอง': booking_id,
                    'รหัสข้อมูลห้อง': room_id,
                    'รูปแบบการเช่า': rentaltype,
                    'หมายเลขติดต่อ': phone,
                    'จำนวนการเช่า': count,
                    'วันทำรายการ': created,
                    'ยอดรวม': total,
                    'ค่ามัดจำ': deposit,
                }

                let rentalData = ''
                for (let i = 0; i < Object.keys(data).length; i++) {
                    const th = Object.keys(data)[i]
                    const td = Object.values(data)[i]
                    let row = `<tr>`
                    row += `<th class="align-middle">${th}</th>`
                    row += `<td class="align-middle">${td}</td>`
                    row += `</tr>`
                    rentalData += row
                }
                $('#rentalTransactionOverdue').val(parseFloat(entries[0].total) - sum_transaction)
                $('#rentalTransactionPaid').val(entries[0].paid)
                $('#bookingTable').html(rentalData)
                $('#rentalMonthlyModal').modal('show')
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })

})