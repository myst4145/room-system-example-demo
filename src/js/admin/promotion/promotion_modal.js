$('button[name="open-promotion-modal"]').click(function () {
    const act = $(this).attr('data-act')
    const id = $(this).attr('data-id')
    getRoomData(act)
    switch (act) {
        case 'insert':
            $('#dateStart').val('')
            $('#dateEnd').val('')
            $('#promotionName').val('')
            $('#amount').val('')
            $.each($('[name="promotiontype"]'), (i, opt) => {
                $(opt).prop('checked', false)
            })
            $.each($('[name="room-number-id"]'), (i, opt) => {
                $(opt).prop('checked', false)
            })
            $('#dateStart').prop('disabled', false)
            $('#promotionSubmit').attr('data-act', act)
            $('#promotionModal').modal('show')
            break;
        case 'update':
            $('#dateStart').prop('disabled', true)
            getDataById(id)
            break;
        default:
            break;
    }

})