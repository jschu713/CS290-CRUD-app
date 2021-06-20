var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit: 10,
  host: 'classmysql.engr.oregonstate.edu',
  user: 'cs290_chujef',
  password: '2203',
  database: 'cs290_chujef'
});

module.exports.pool = pool;
