const sqliteConnection = require("../../sqlite")
const createUser = require("./migrations")

async function migrateRun(){
    const shemas = [createUser].join("")
    sqliteConnection().then(db => db.exec(shemas)).catch(error=> console.log(error))

}

module.exports = migrateRun