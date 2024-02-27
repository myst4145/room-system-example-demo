function getTransactionByDate(date, id, type) {
    axios.get(`/additionalcost/transaction/data/${id}/${date}/${type}`)
        .then((response) => {
            if (!response.data.result) {
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
            if (response.data.result) {
                const transaction = response.data.entries[0]
                const [year, month] = transaction.date.split('-')
                $('#year').val(year)
                $('#total').val(transaction.total)
                $('#paid').val(transaction.paid)
                $('#overdue').val(transaction.overdue)
                retainRadioValue($('[name="type"]'), transaction.type)
                retainOptionValue($('#month'), month)
                retainOptionValue($('#status'), transaction.status)
                $('#additionalCostModal').modal('show')
            }
        })
        .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', err)
        })
}
