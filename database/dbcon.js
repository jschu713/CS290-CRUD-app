var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: '[username]',
  password: '[username]',
  database: '[username]'
});

module.exports.pool = pool;
