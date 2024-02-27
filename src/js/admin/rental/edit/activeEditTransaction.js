function activeEditTransaction() {
    $('button[name="paste-status"]').removeClass('d-none')
    $('button[name="paste-amount"]').removeClass('d-none')
    $('button[name="static"]').prop('disabled', true)
    $('button[name="dynamic"]').prop('disabled', false).removeClass('d-none')
    $('[name="transaction-status"]')
        .removeClass('form-control-plaintext')
        .addClass('form-control')
        .prop('disabled', false)
    $.each($('[name="transaction-delete"]'), (i, btn) => {
        if (i == 0 || i == $('[name="transaction-delete"]').length - 1) {
            $(btn).prop('disabled', false)
        }
    })
}
