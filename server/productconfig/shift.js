var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var util = require('../common/utility');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {

    getShiftsList: function (req, callback) {

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
                response.return_message = "Error getting Shifts";
                connection.release();
                callback(response);

            }
            connection.query(config.product.getShiftsList, [util.getuserId(req.headers.token)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Shifts"
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows[0]);
                    response.data = rows[0];
                    connection.release();
                    callback(response);
    
                }

            });

        });
    },
    getShift: function (req, callback) {
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
                response.return_message = "Error getting Shift Details";
                connection.release();
                callback(response);

            }
            connection.query(config.product.getShift, [
                req.query.shift_id,
                util.getuserId(req.headers.token)
            ], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error getting Shift Details";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    response.data = rows[0];
                    connection.release();
                    callback((response));
                }

            });

        });
    },

    saveShift: function (req, callback) {
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
                response.return_message = "Error Saving Shift";
                callback(response);
            }
            connection.beginTransaction();
            var mode;
            if (req.body.prsh_id == "" || req.body.prsh_id == null) {
                mode = " created ";
            }
            else {
                mode = " saved ";
            }
            connection.query(config.product.saveShift,
                [req.body.company
                    , req.body.shift_id
                    , req.body.shiftName
                    , req.body.startTime_hours
                    , req.body.startTime_mins
                    , req.body.endTime_hours
                    , req.body.endTime_mins
                    , req.body.isActive
                    , util.getuserId(req.headers.token)
                ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving shift";
                        callback(response);
                    } else {

                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);

                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            connection.commit();
                            connection.release();
                            response.return_code = 0;
                            response.data = json[0];
                            response.return_message = "Shift " + req.body.shiftName + mode + " successfully";
                            callback(response);

                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            callback(response);
                        }

                    }

                });
        });
    },
};

