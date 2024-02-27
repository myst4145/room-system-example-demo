function transactionMonthlyDelete(evt) {
    const transactionPaidEl = $('[name="transaction-paid"]')
    const transactionPaid = $.map(transactionPaidEl, (el) => parseFloat($(el).val()))
    const transactionPaidTotal = transactionPaid.reduce((prev, current) => prev + current, 0)
    const tagName = $(evt.target).prop('tagName')
    const btn = tagName == 'I' ? $(evt.target).parent() : $(evt.target)
    const time_count = parseFloat($('#timeCount').val()) - 1
    const price = parseFloat($('#price').val())
    const total = time_count * price
    const count = transactionPaid.length - 1
    const date = $(btn).data('date')
    const overdue = count > 0 ? (total - transactionPaidTotal) : 0
    const transactionOldBefore = JSON.parse($('#transactionOldAfter').val())
    const transactionOldAfter = transactionOldBefore.filter((t) => t.date != date)
    const checkinMonthAndYear = transactionOldBefore[0].date
    const checkoutMonthAndYear = transactionOldAfter[transactionOldAfter.length - 1].date
    const [ey, em] = checkoutMonthAndYear.split('-')
    const checkoutDt = sumMonth(ey, em)
    const checkin = `${checkinMonthAndYear}-01`
    const checkout = `${checkoutMonthAndYear}-${checkoutDt}`
    $('#transactionOldAfter').val(JSON.stringify(transactionOldAfter))

    btn.parent().parent().remove()
    $('#total').val(total)
    $('#timeCount').val(count)
    $('#overdue').val(overdue < 0 ? 0 : overdue)
    $('#paid').val(count > 0 ? transactionPaidTotal : 0)
    $('#checkin').val(checkin)
    $('#checkout').val(checkout)
    activeEditTransaction()
}