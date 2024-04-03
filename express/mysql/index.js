const mysql = require('mysql');


const conn = mysql.createPool(
  {
    connectionLimit: 10,
    user: 'root',
    password: '',
    host: '104.199.224.10',
    database: 'risWEB',
    port: 3306
  }
)

module.exports = conn;