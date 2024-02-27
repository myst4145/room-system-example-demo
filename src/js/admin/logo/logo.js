function setPropLogoFileOpt(id) {
    $.each($('[name="logo-file-opt"]'), (i, opt) => {
        if ($(opt).attr('id') == id) {
            $(opt).prop('checked', true)
        }
    })
}

function setPropIconOpt(id) {
    $.each($('[name="icon-opt"]'), (i, opt) => {
        if ($(opt).attr('id') == id) {
            $(opt).prop('checked', true)
        }
    })
}
$('#logo-file').change(function () {
    const logoFile = $(this)[0].files[0]
    if (logoFile != undefined) {
        const src = URL.createObjectURL(logoFile)
        const img = `<img src="${src}">`
        $('#logoNewPreview').html(img)
        setPropLogoFileOpt('newlogoFile')
    } else {
        $('#logoNewPreview').children().remove()
        setPropLogoFileOpt('oldlogoFile')
    }

})
$('#icon-file').change(function () {
    const iconFile = $(this)[0].files[0]
    if (iconFile != undefined) {
        const src = URL.createObjectURL(iconFile)
        const img = `<img src="${src}">`
        $('#iconNewPreview').html(img)
        setPropIconOpt('newIcon')
    } else {
        $('#iconNewPreview').children().remove()
        setPropIconOpt('oldIcon')
    }
})