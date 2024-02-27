function getOfficerDataById(id) {
    axios.get(`/officer/user/data/${id}`)
        .then((response) => {
            if (response.data.result) {
                const entries = response.data.entries
                $('#fname').val(entries[0].officer_fname)
                $('#lname').val(entries[0].officer_lname)
                $('#username').attr('data-auth', 'true').val(entries[0].username)
                retainRadioValue($('[name="role"]'), entries[0].role)
                $('#officerManageModal').modal('show')
            }

            if (!response.data.result) {
                queryFail('แจ้งเตือน', 'โหลดข้อมูลล้มเหลว', response.data.errr)
            }
        }).catch((err) => {
            queryFail('แจ้งข้อผิดพลาด', err, '')
        })
}
