$('#contact-submit').click(function() {
    const contactForm = [{
        'name': 'company',
        'input': $('#company'),
        'validate': $('#validate-company'),
        'msg': 'ป้อนชื่อบริษัทของคุณ'
      }, {
        'name': 'location',
        'input': $('#location'),
        'validate': $('#validate-location'),
        'msg': 'ป้อนที่ตั้งบริษัทของคุณ'
      }, {
        'name': 'sub-distict',
        'input': $('#sub-district'),
        'validate': $('#validate-sub-district'),
        'msg': 'ป้อนแขวง - ตำบล'
      }, {
        'name': 'distict',
        'input': $('#district'),
        'validate': $('#validate-district'),
        'msg': 'ป้อนเขต - อำเภอ'
      }, {
        'name': 'province',
        'input': $('#province'),
        'validate': $('#validate-province'),
        'msg': 'ป้อนจังหวัด'
      },
      {
        'name': 'postcode',
        'input': $('#postcode'),
        'validate': $('#validate-postcode'),
        'msg': 'ป้อนรหัสไปรษณีย์'
      }, {
        'name': 'contact',
        'input': $('#contact-number'),
        'validate': $('#validate-contact'),
        'msg': 'ป้อนเบอร์ติดต่อ'
      }, {
        'name': 'email',
        'input': $('#email'),
        'validate': $('#validate-email'),
        'msg': 'ป้อนอีเมล'
      }
    ]
    let emptyCount = 0
    contactForm.forEach((fd) => {
      const {
        input,
        msg,
        validate
      } = fd

      const v = input.val().trim()
      if (v == '') {
        validateformEmpty(true, validate, msg)
        emptyCount++
      } else {
        validateformEmpty(false, validate, msg)
      }
    })
    const file = $('#logo')[0].files
    const logo_collect = $('[name="logo-collect"]').filter(':checked').val()
    if (logo_collect == 'new' && file.length == 0) {
      validateformEmpty(true, $('#validate-collect'), 'โปรดเลือกอัพโหลดโกโล้ใหม่')
      emptyCount++
    } else {
      validateformEmpty(false, $('#validate-collect'), '')
    }

    if (emptyCount == 0) {



      const formData = new FormData()
      formData.append('company', $('#company').val())
      formData.append('location', $('#location').val())
      formData.append('road_alley', $('#road-alley').val())
      formData.append('sub_district', $('#sub-district').val())
      formData.append('district', $('#district').val())
      formData.append('province', $('#province').val())
      formData.append('postcode', $('#postcode').val())
      formData.append('contact_number', $('#contact-number').val())
      formData.append('email', $('#email').val(), )
      formData.append('tax_id', $('#taxIdNumber').val().trim())
      formData.append('logo_collect', $('[name="logo-collect"]').filter(':checked').val())

      if (file.length > 0) formData.append('shop_logo', file[0])

      axios.post('/about/contact/save', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((res) => {
          const result = res.data.result
          if (result) querySuccess('บันทึกสำเร็จ')
          if (!result) queryFail('เกี่ยวกับเว็บไซต์', 'บันทึกข้อมูลล้มเหลว', res.data.err)

        })
        .catch((err) => {
            queryFail('ข้อผิดพลาด',  err,'')
        })
    }
  })