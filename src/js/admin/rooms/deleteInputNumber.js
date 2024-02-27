function deleteInputNumber(event) {

    const roomNumberSoftDelete = $('#roomNumberSoftDelete').val()
    let room_number = []
    const tagName = $(event.target).prop('tagName')
    const element = tagName == 'I' ? $(event.target).parent().parent() : $(event.target).parent()
    const id = $(element).parent().parent().attr('data-number')
    if (id == '' || !id) $(element).parent().parent().remove()
    if (id != '' && id) {
        const softDeleteById = $(`#${id}`)
            .children(':eq(0)')
            .children(':eq(4)')
            .children()
            .filter('select')
        $.each($(softDeleteById).children(), (i, opt) => {
            console.log($(opt).val())
            if ($(opt).val() == 'true') {
                console.log('ddddd')
                $(opt).prop('selected', true)
            }
        })
    }
    setRoomCount()
}