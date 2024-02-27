function payMonthlyByDate(date, id) {
    $('#rentalMonthlySubmit').attr('data-id', id)
    $('#rentalMonthlySubmit').attr('data-date', date)
    axios.get(`/booking/transaction/${id}/${date}`)
        .then((response) => {

            if (!response.data.result) {
                queryFail('การชำระเงิน', 'ชำระเงินไม่สำเร็จ', err)
            }
            if (response.data.result) {
                const transaction = response.data.transaction
                const deposit = response.data.deposit
                const byDate = transaction.filter((t) => t.date == date)
                const paid = byDate[0].paid
                const status = byDate[0].status
                const [y, m] = date.split('-')
                const month = getThaiMonth(m)
                const year = getFullYearThai(y)
                const isDisabled = deposit == 0

                $('#rentalMonthlyYear').val(year)
                $('#rentalMonthlyMonth').val(month)
                $('#rentalMonthlyPaid').val(paid)
                $('#rentalMonthlyDate').val(date)
                $('#rentalMonthlyAmount').val(0)
                $('#rentalMonthlyDeposit').val(deposit)
                $('#rentalMonthlyDeductDeposit').prop('disabled', isDisabled)
                retainOptionValue($('#rentalMonthlyOptionPay'), status)
                $('#rentalMonthlyTransactionModal').modal('show')
            }

        })
        .catch((err) => {
            queryFail('การชำระเงิน', 'ชำระเงินไม่สำเร็จ', err)
        })
}