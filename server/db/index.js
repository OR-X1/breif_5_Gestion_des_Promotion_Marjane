const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    user: 'root',
    password: '',
    database: 'api_express_test',
    host: 'localhost',
    port: '3306'
});

let api_express_db = {};

api_express_db.all = () => {
    return new Promise((resolve, reject) => {
        pool.query('select * from test1', (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results);
        });
    });
}

api_express_db.one = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('select * from test1 where id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

api_express_db.insert = (name, tel, ville) => {

    return new Promise((resolve, reject) => {
        pool.query('INSERT INTO `test1` (`name`, `tel`, `ville`) VALUES (?, ?, ?)', [name, tel, ville], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

api_express_db.delete = (id) => {
    return new Promise((resolve, reject) => {
        pool.query('delete from test1 where id = ?', [id], (err, results) => {
            if(err) {
                return reject(err);
            }
            return resolve(results[0]);
        });
    });
}

module.exports = api_express_db;