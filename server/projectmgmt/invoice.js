var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
const logger = log4js.getLogger('invoice');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');

module.exports = {

    //post call to save the invoice
    saveInvoice: function (req, callback) {
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
            connection.query(config.invoice.saveInvoice, [
                req.body.PMINV_ID,
                req.body.PMINV_TYPE,
                req.body.PMINV_STATUS,
                req.body.PMINV_DESCRIPTION,
                req.body.PMINV_AMOUNT,
                req.body.PMINV_PAYMENT_MODE,
                req.body.PMINV_TRANSACTION_IDENTIFIER,
                req.body.PMINV_PAID_BY,
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
                        var json = JSON.parse(string);
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

    //get call to list all the invoice
    getInvoiceList: function (req, callback) {
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
            connection.query(config.invoice.getInvoiceList, [util.getuserId(req.headers.authorization)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in fetching the invoice Details";

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

    searchInvoice: function (req, callback) {
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
            connection.query(config.invoice.getInvoice, [req.body.PMINV_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
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

     searchInvoiceByProject: function (req, callback) {
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
            connection.query(config.invoice.searchInvoice, [req.body.PMPRJ_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in retriving the Invoice Details";
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

    //Call to delete Invoice

    deleteInvoice: function (req, callback) {
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
            connection.query(config.invoice.deleteInvoice, [req.body.PMINV_ID], function (err, rows) {
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