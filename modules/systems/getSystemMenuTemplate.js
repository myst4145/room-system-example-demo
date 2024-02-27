const { system_menu } = require("./systemMenu")

function getSystemMenuTemplate(p) {

    const menuIndex = system_menu.findIndex((m) => m.p == p)
    let {template,title} = system_menu[menuIndex]
    return {template,title}
}
module.exports = { getSystemMenuTemplate }