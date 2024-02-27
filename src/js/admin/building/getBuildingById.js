function getBuildingById(id) {
    axios.get(`/api/building/edit/${id}`)
        .then((response) => {
            console.log(response)
            if (response.data.result) {
                $('#buildingName').val(response.data.entries.building_name)
                $('#buildingNumber').val(response.data.entries.building_number)
                $('#floorCount').val(response.data.entries.floor_count)
                $('#buildingModal').modal('show')
            }
            if (!response.data.result) {
                queryFail('เกิดข้อผิดพลาด', 'ไม่สามารถโหลดข้อมูลได้', response.data.err)
            }
        })
        .catch((err) => {
            queryFail('เกิดข้อผิดพลาด', err, '')
        })
}