var config = require('../config/config');
var log4js = require('../config/log4j');
const logger = log4js.getLogger('chat');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');
var mysql = require('mysql');
var fs = require('fs');

module.exports = {
    getConfig: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        if (req.body.server == "Pabbu AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else  if (req.body.server == "Sathesh AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cjreawaryxhc.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Sakthi AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cakwubhfkyxj.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Dedicated") {
            var pool = mysql.createPool({
                host: '192.168.29.95',
                user: config.dbconcfig.user,
                password: config.dbconcfig.password,
                database: config.dbconcfig.database,
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else {
            var pool = require('../common/DBConnection');
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                var query = req.body.job == "Regular" ? config.hyperloop.config : config.hyperloop.configDemand;
                connection.query(query, function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = err;
                            response.return_code = 1
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows;
                            connection.release();
                            callback(response);
                            return;
                        }
                    });
            }
        });
    },

    updateConfig: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        
        if (req.body.server == "Pabbu AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else  if (req.body.server == "Sathesh AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cjreawaryxhc.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Sakthi AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cakwubhfkyxj.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Dedicated") {
            var pool = mysql.createPool({
                host: '192.168.29.95',
                user: config.dbconcfig.user,
                password: config.dbconcfig.password,
                database: config.dbconcfig.database,
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Master DB") {
            var pool = require('../common/DBConnection');
        }

        pool.getConnection(function (err, connection) {

            if (err) {
                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                var query = req.body.jobType == "Regular" ? config.hyperloop.updateConfig : config.hyperloop.updateConfigDemand;
                connection.query(query,
                    [req.body.allowed_percentages,
                    req.body.buy_offset,
                    req.body.buy_limit,
                    req.body.buy_sl,
                    req.body.buy_tp,
                    req.body.order_type,
                    req.body.rev_offset,
                    req.body.sell_limit,
                    req.body.sell_offset,
                    req.body.sell_sl,
                    req.body.sell_tp,
                    req.body.trend_offset,
                    req.body.units,
                    req.body.id], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error saving Configurations Range";
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.return_code = 0;
                            connection.release();
                            callback(response);
                            return;
                        }
                    }
                );
            }
        });
    },

    
    insertConfig: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        
        if (req.body.server == "Pabbu AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else  if (req.body.server == "Sathesh AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cjreawaryxhc.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Sakthi AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cakwubhfkyxj.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Dedicated") {
            var pool = mysql.createPool({
                host: '192.168.29.95',
                user: config.dbconcfig.user,
                password: config.dbconcfig.password,
                database: config.dbconcfig.database,
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Master DB") {
            var pool = require('../common/DBConnection');
        }

        pool.getConnection(function (err, connection) {

            if (err) {
                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                var query = req.body.jobType == "Regular" ? config.hyperloop.insertConfig : config.hyperloop.insertConfigDemand;
                connection.query(query,
                    [req.body.currency,
                    req.body.order_type,
                    req.body.units,
                    req.body.buy_limit,
                    req.body.buy_tp,
                    req.body.buy_sl,
                    req.body.sell_limit,
                    req.body.buy_offset,
                    req.body.sell_tp,
                    req.body.sell_sl,
                    req.body.active,
                    req.body.allowed_percentages,
                    new Date(),
                    req.body.sell_offset,
                    req.body.rev_offset,
                    req.body.trend_offset], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error saving Configurations Range";
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.return_code = 0;
                            connection.release();
                            callback(response);
                            return;
                        }
                    }
                );
            }
        });
    },

    getAccountSettings: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        if (req.body.server == "Pabbu AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else  if (req.body.server == "Sathesh AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cjreawaryxhc.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Sakthi AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cakwubhfkyxj.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Dedicated") {
            var pool = mysql.createPool({
                host: '192.168.29.95',
                user: config.dbconcfig.user,
                password: config.dbconcfig.password,
                database: config.dbconcfig.database,
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else {
            var pool = require('../common/DBConnection');
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                connection.query(config.hyperloop.getAccountSettings,
                    [req.body.currency], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = err;
                            response.return_code = 1
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows;
                            connection.release();
                            callback(response);
                            return;
                        }
                    });
            }
        });
    },

    updateAccountSettings: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
       
        if (req.body.server == "Pabbu AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else  if (req.body.server == "Sathesh AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cjreawaryxhc.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Sakthi AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cakwubhfkyxj.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Dedicated") {
            var pool = mysql.createPool({
                host: '192.168.29.95',
                user: config.dbconcfig.user,
                password: config.dbconcfig.password,
                database: config.dbconcfig.database,
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else {
            var pool = require('../common/DBConnection');
        }

        pool.getConnection(function (err, connection) {
            

            if (err) {
                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                connection.query(config.hyperloop.updateAccountSettings,
                    [req.body.account_id,
                    req.body.account_status,
                    req.body.account_type,
                    req.body.account_rev_type,
                    req.body.account_env,
                    req.body.account_alias,
                    req.body.account_mode,
                    req.body.id], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error saving Configurations Range";
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.return_code = 0;
                            connection.release();
                            callback(response);
                            return;
                        }
                    }
                );
            }
        });
    },

    insertAccount: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
       
        if (req.body.server == "Pabbu AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.c15ujyuuwji7.ap-south-1.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else  if (req.body.server == "Sathesh AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cjreawaryxhc.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Sakthi AWS") {
            var pool = mysql.createPool({
                host: 'hyperloop.cakwubhfkyxj.us-east-2.rds.amazonaws.com',
                user: 'admin',
                password: 'hyperloop',
                database: 'hyperloop',
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else if (req.body.server == "Dedicated") {
            var pool = mysql.createPool({
                host: '192.168.29.95',
                user: config.dbconcfig.user,
                password: config.dbconcfig.password,
                database: config.dbconcfig.database,
                connectionLimit: 10000,
                multipleStatements: true
              });
        } else {
            var pool = require('../common/DBConnection');
        }

        pool.getConnection(function (err, connection) {
            

            if (err) {
                logger.error("An error occurred: " + err);
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
                return;
            }
            else {
                connection.query(config.hyperloop.insertAccount,
                    [req.body.account_id,
                    req.body.account_url,
                    req.body.account_domain,
                    req.body.account_key,
                    req.body.account_status,
                    req.body.account_type,
                    req.body.account_rev_type,
                    req.body.account_env,
                    req.body.account_alias,
                    req.body.account_mode], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error saving Configurations Range";
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.return_code = 0;
                            connection.release();
                            callback(response);
                            return;
                        }
                    }
                );
            }
        });
    },
}