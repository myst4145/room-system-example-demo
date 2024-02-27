$("#addSpecialOption").click(function () {
  const specialOptionInput = $("#specialOptionCount");
  const c = Number.parseInt(specialOptionInput.val());

  let specialOptionEl = "";
  if (!isNaN(c)) {
    for (let i = 0; i < c; i++) {
      specialOptionEl += `
            <div class="input-group my-1">
              <input type="text" class="form-control" name="special-options-text" placeholder="ป้อนข้อมูลเพิ่มสิ่งของเครื่องใช้ เช่น โชฟา ตู้เย็น">
              <button class="btn btn-sm bg-gradient-secondary border-0 rounded-0" onclick="deleteSpecialText(event)">
                <i class="fa-solid fa-trash-can"></i>
              </button>
            </div>
          `;
    }
    $("#n-special-options").append(specialOptionEl);
    specialOptionInput.val("1");
  }
});