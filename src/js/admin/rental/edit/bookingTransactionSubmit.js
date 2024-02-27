$('#bookingTransactionSubmit').click(function () {
    const transactionPaid = $('[name="transaction-paid"]')
    const transaction = $.map(transactionPaid, (el) => $(el).val())
    const transactionStatus = $.map($('[name="transaction-status"]'), (el) => $(el).val())
    const transactionOldAfter = JSON.parse($('#transactionOldAfter').val())

    for (let i = 0; i < transactionOldAfter.length; i++) {
        transactionOldAfter[i].paid = transaction[i]
        transactionOldAfter[i].status = transactionStatus[i]
    }
    createTransactionByBtn(transactionOldAfter, $('#transactionTable'))
    transactionPaid.removeClass('custom-select')
    transactionPaid.addClass('form-control-plaintext')
    transactionPaid.prop('disabled', true)

    const transactionTotal = transactionOldAfter
        .map((t) => parseFloat(t.paid))
        .reduce((prev, current) => {
            prev + current
        }, 0)

    $('#transactionOldAfter').val(JSON.stringify(transactionOldAfter))
    $('#transactionOldBefore').val(JSON.stringify(transactionOldAfter))
    disabledEditTransaction()
})