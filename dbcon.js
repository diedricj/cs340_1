var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_diedricj',
  password        : '0268',
  database        : 'cs340_diedricj'
});
module.exports.pool = pool;
