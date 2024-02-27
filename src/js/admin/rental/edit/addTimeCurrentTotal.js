function addTimeCurrentTotal(evt) {
    const overdue = parseFloat($('#overdue').attr('data-overdue'))
    const paid = parseFloat($('#paid').attr('data-paid'))
    const input = $(evt.target)
    const value = parseFloat(input.val())
    const old = parseFloat($(evt.target).attr('data-total'))
    let total = parseFloat($('#total').attr('data-total'))

    total -= old
    if (!isNaN(value)) total += value
    if (isNaN(value)) input.val(0)
    if (!isNaN(overdue)) {
        $('#overdue').val(total - overdue)
        $('#overdue').attr('data-overdue', total - overdue)
    }
    $('#total').val(total)
}
