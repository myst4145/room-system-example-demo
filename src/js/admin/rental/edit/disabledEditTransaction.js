function disabledEditTransaction() {
    $('button[name="static"]').prop('disabled', false)
    $('button[name="dynamic"]').prop('disabled', true).addClass('d-none')
    $('[name="transaction-status"]').addClass('form-control-plaintext')
        .removeClass('form-control')
        .prop('disabled', false)
    $('[name="transaction-delete"]').prop('disabled', true)
}
