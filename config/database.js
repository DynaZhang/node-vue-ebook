const mysql = require('mysql');

const DATABASE_CONFIG = {
  host: '127.0.0.1',
  user: 'root',
  password: '123456',
  port: '3306',
  database: 'book'
};

function createConnection() {
  return mysql.createConnection(DATABASE_CONFIG)
}

module.exports = {
  createConnection
};
