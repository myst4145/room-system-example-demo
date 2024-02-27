$('#socialSubmit').click(function () {
    const data = [{
        'group_type': 'facebook',
        'input_type': 'name',
        'data': $('#fb-name').val().trim()
    },
    {
        'group_type': 'facebook',
        'input_type': 'link',
        'data': $('#fb-link').val().trim()
    }, {
        'group_type': 'instagram',
        'input_type': 'name',
        'data': $('#ig-name').val().trim()
    },
    {
        'group_type': 'instagram',
        'input_type': 'link',
        'data': $('#ig-link').val().trim()
    },
    {
        'group_type': 'twitter',
        'input_type': 'name',
        'data': $('#twitter-name').val().trim()
    },
    {
        'group_type': 'twitter',
        'input_type': 'link',
        'data': $('#twitter-link').val().trim()
    },
    {
        'group_type': 'line',
        'input_type': 'name',
        'data': $('#line-id').val().trim()
    },
    {
        'group_type': 'line',
        'input_type': 'link',
        'data': $('#line-link').val().trim()
    },
    {
        'group_type': 'tiktok',
        'input_type': 'name',
        'data': $('#tiktok-name').val().trim()
    },
    {
        'group_type': 'tiktok',
        'input_type': 'link',
        'data': $('#tiktok-link').val().trim()
    },
    {
        'group_type': 'youtube',
        'input_type': 'name',
        'data': $('#youtube-name').val().trim()
    },
    {
        'group_type': 'youtube',
        'input_type': 'link',
        'data': $('#youtube-link').val().trim()
    }
    ]
    axios.post('/social/update', data)
        .then((response) => {
            if (response.data.result) querySuccess('บันทึกสำเร็จ')
            if (!response.data.result) queryFail('', 'บันทึกล้มเหลว', response.data.err)
        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด', err, '')
        })
})