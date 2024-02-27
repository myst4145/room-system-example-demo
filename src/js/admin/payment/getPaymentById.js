function getPaymentById(id) {
    axios.get(`/payment/edit/${id}`)
        .then((res) => {
            if (res.data.result) {
                const data = res.data.entries[0]
                const {
                    account_name,
                    bank_branch,
                    bank_name,
                    bank_number,
                    created,
                    modified,
                    payment_id
                } = data


                const editBankname = $('#bankname')
                const banknameOpt = editBankname.children()

                for (let i = 0; i < banknameOpt.length; i++) {
                    const optVal = $(banknameOpt[i]).val()

                    if (optVal == bank_name) {
                        $(banknameOpt[i]).prop('selected', true)
                    }
                }

                $('#bank-branch').val(bank_branch)
                $('#bank-number').val(bank_number)
                $('#account-name').val(account_name)
                $('#payment-modal').modal('show')
            }
            if (!res.data.result) {
                queryFail('แจ้งเตือน', 'ไม่สามารถโหลดข้อมูลได้', res.data.err)
            }
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
}