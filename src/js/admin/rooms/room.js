$('[name="rentaltype"]').change(function () {
    const t = $(this).val()
    const disabled = t == 'daily'
    $('[name="status"]').prop('disabled', disabled).val('available')
})

$('#room-upload').change(function(e) {
    const file = e.target.files;
    let imgItem = ``;
    for (let i = 0; i < file.length; i++) {
      const src = URL.createObjectURL(file[i]);
      const img =
        `<img src="${src}" class="example-imgview ">`;
      imgItem += img;
    }

    $("#example-preview").html(imgItem);
  });