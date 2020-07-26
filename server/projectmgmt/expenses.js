var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
const logger = log4js.getLogger('expenses');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');

module.exports = {

    //post call to save the expenses
    saveExpense: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error Saving Expence";
                connection.release();
                callback(response);
                return;
            }

            connection.beginTransaction();
            connection.query(config.expenses.saveExpense, [
                req.body.PMEXP_ID,
                req.body.PMEXP_TYPE,
                req.body.PMEXP_AMOUNT,
                req.body.PMPRJ_ID,
                util.getuserId(req.headers.authorization)
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving User";
                        callback(response);
                        return;
                    } else {
                        var string = JSON.stringify(result);
                        console.log(string);
                        var json = JSON.parse(string);
                        console.log(json);
                        if (!(json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0)) {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorflag = true;
                            connection.rollback();
                            connction.release();
                            callback(response);
                            logger.error(response);
                        }
                        // if (i == req.body.length - 1) {
                        connection.commit();
                        connection.release();
                        callback(response);
                        logger.error("saved succesfullly");
                    }

                });

        });
    },

    //get call to list all the expenses
    getExpenseList: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error in Meta Data Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            connection.query(config.expenses.getExpenseList, [util.getuserId(req.headers.authorization)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in fetching the expenses Details";

                } else {
                    response.data = rows[0];
                }
                connection.release();
                callback(response);
                return;

            });

        });
    },
    //post call to search the project

    searchExpense: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error in Meta Data Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            connection.query(config.project.getExpense, [req.body.PMEXP_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in retriving the Opportunity Details";
                } else {
                    errorlogger.error(rows);
                    response.data = rows[0];
                }
                connection.release();
                callback(response);
                return;

            });

        });
    },

     //post call to search the project by Opportunity

     searchExpenseByProject: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error in Meta Data Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            connection.query(config.expenses.searchExpense, [req.body.PMPRJ_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in retriving the Opportunity Details";
                } else {
                    errorlogger.error(rows);
                    response.data = rows[0];
                }
                connection.release();
                callback(response);
                return;

            });

        });
    },

    //Call to delete Expense

    deleteExpense: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error in Meta Data Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            connection.query(config.expenses.deleteExpense, [req.body.PMEXP_ID], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in deleting the Opportunity Details";
                } else {
                    errorlogger.error(rows);
                    response.data = response.return_message;
                }
                connection.release();
                callback(response);
                return;

            });

        });
    },

}