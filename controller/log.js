const {
    db
} = require('../db/index')

module.exports = getxx = {
    insertlog: (mesg) => {
        db.query(`INSERT INTO logs (comment,date) VALUES ('${mesg}',now())`)
    }
}