function querySuccess(title, times = 1000) {
    Swal.fire({
        position: 'top',
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: times
    })
    setInterval(() => {
        window.location.reload()
    }, times)

}

function queryFail(title, subTitle, err) {
    Swal.fire({
        icon: 'error',
        title: title,
        text: subTitle,
        footer: err
    })
}

function confirm(title, subTitle) {
    return Swal.fire({
        title: title,
        text: subTitle,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#28a745',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
    })
}


function statusErr() {
    Swal.fire({
        icon: 'error',
        title: 'แจ้งเตือน',
        text: 'เกิดผิดพลาด !',
    })
}


function alertMsg(title, subTitle) {
    return Swal.fire({
        icon: 'error',
        title: title,
        text: subTitle,
    })
}
function success(title) {
    Swal.fire({
        position: 'top',
        icon: 'success',
        title: title,
        showConfirmButton: false,
        timer: 1000
    })
}