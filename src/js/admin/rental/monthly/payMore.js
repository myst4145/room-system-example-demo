function payMore(id, data) {
    axios.patch(`/booking/monthly/paymore/${id}`, data)
        .then((response) => {
            console.log(response.data)
            if (response.data.result) {
                const overdue = response.data.overdue
                const paid = response.data.paid
                const pay_at = response.data.pay_at
                const amount = response.data.amount
                const isDisabled = data.status == 'all'
                const status = getTransactionPayAt(data.status)
                const textStatus = getTransactionPayAtText(data.status)
                let p = `<p class="m-0 font-weight-bold ${textStatus}">`
                p += `${status}`
                p += `</p>`
                console.log('data.status : ', data.status)
                console.log(paid)
                $('.transaction-status').filter(`[data-date="${data.date}"]`).html(p)
                $('[name="booking-overdue"]').filter(`[data-id="${id}"]`).val(overdue)
                $('[name="transction-paid-table"]')
                    .filter(`[data-date="${data.date}"]`)
                    .val(amount)
                $('[name="transction-payat"]')
                    .filter(`[data-date="${data.date}"]`)
                    .val(pay_at)
                $('#rentalTransactionOverdue').val(overdue)
                $('#rentalTransactionPaid').val(paid)
                $('[name="transaction-pay"]')
                    .filter(`[data-date="${data.date}"]`)
                    .prop('disabled', isDisabled)
                success('ชำระเรียบร้อย')
                $('#rentalMonthlyTransactionModal').modal('hide')
            }
            if (!response.data.result) {

                queryFail('การชำระเงิน', 'ชำระเงินไม่สำเร็จ', err)
            }
        })
        .catch((err) => {
            queryFail('การชำระเงิน', 'ชำระเงินไม่สำเร็จ', err)
        })
}