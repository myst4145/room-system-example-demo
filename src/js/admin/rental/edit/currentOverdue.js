function currentOverdue() {
    const overdue = parseFloat($('#overdue').attr('data-overdue'))
    const paid = parseFloat($('#paid').val())
    let total = parseFloat($('#total').attr('data-total'))
    if (!isNaN(total) && !isNaN(overdue) && (paid <= total)) {
        $('#overdue').val(total - paid)
    } else {
        $('#overdue').val(overdue)
        $('#paid').val(total - overdue)
    }
}