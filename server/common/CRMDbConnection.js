var mysql = require('mysql');
var config = require('../config/config');

var CRMDbConnection = mysql.createPool({
    host: config.crmdbconcfig.host,
    user: config.crmdbconcfig.user,
    password: config.crmdbconcfig.password,
    database: config.crmdbconcfig.database,
    multipleStatements: true
  });

  
  module.exports = CRMDbConnection;