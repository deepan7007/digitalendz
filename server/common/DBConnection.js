var mysql = require('mysql');
var config = require('../config/config');

var DbConnection = mysql.createPool({
    host: config.dbconcfig.host,
    user: config.dbconcfig.user,
    password: config.dbconcfig.password,
    database: config.dbconcfig.database,
    connectionLimit: 10000,
    multipleStatements: true
  });

  
  module.exports = DbConnection;