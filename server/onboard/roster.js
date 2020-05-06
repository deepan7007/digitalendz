var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var util = require('../common/utility');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    getRosterList: function (req, callback) {

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
                response.return_message = "Error getting Rosters";
                connection.release();
                callback(response);

            }
            connection.query(config.hrms.getRosterList, [util.getuserId(req.headers.authorization)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Rosters"
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
    getRoster: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        rosterdata = {
            "roster": [],
            "employee": []
        };
        response.data = rosterdata;
        pool.getConnection(function (err, connection) {

            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error getting Roster Details";
                connection.release();
                callback(response);

            }
            connection.query(config.hrms.getRoster, [
                req.query.roster_id,
                util.getuserId(req.headers.authorization)
            ], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error getting Roster Details";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    response.data.roster = rows[0];
                    connection.query(config.hrms.getEmployeeRoster, [
                        req.query.roster_id,
                        util.getuserId(req.headers.authorization)
                    ], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_code = 1;
                            response.return_message = "Error getting Roster Details";
                            connection.release();
                            callback(response);
                        } else {
                            response.data.employee = rows[0];
                            connection.release();
                            callback((response));
                        }
                    });
                }

            });

        });
    },

    saveRoster: function (req, callback) {
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
            if (req.body.roster_id == "" || req.body.roster_id == null) {
                mode = " created ";
            }
            else {
                mode = " saved ";
            }
            connection.query(config.hrms.saveRoster,
                [req.body.roster_id
                    , req.body.rosterName
                    , new Date(req.body.startDate_year, req.body.startDate_month - 1, req.body.startDate_day)
                    , new Date(req.body.endDate_year, req.body.endDate_month - 1, req.body.endDate_day)
                    , req.body.startTime_hours
                    , req.body.startTime_mins
                    , req.body.endTime_hours
                    , req.body.endTime_mins
                    , util.getuserId(req.headers.authorization)
                ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving Roster";
                        callback(response);
                    } else {

                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);

                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            response.return_code = 0;
                            response.data = json[0];
                            response.return_message = "Roster " + req.body.rosterName + mode + " successfully";
                            errorlogger.error(response.return_message);
                            if (req.body.employeedata.length > 0) {
                                module.exports.saveEmployees(req, connection, json[0][0].EMRS_ID, req.body.employeedata, response, function (result) {
                                    try {
                                        connection.release();
                                        callback(result);
                                        return;
                                    }
                                    catch (error) {
                                        errorlogger.error(error, null);
                                        callback(result);
                                        return;
                                    }

                                });

                            }
                            else {
                                try {
                                    connection.release();
                                    callback(response);
                                    return;
                                }
                                catch (error) {
                                    errorlogger.error(error, null);
                                    callback(response);
                                    return;
                                }

                            }

                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            callback(response);
                            return;
                        }

                    }

                });
        });
    },
    saveEmployees(req, connection, emrs_id, employees, response, callback) {
        var errorFlag = false;
        var rosterempsave = new Promise((resolve, reject) => {

            employees.forEach((element, index, array) => {
                connection.query(config.hrms.saveEmployeeRoster,
                    [(element.EMER_ID == "") ? null : element.EMER_ID
                        , element.EMPH_ID
                        , emrs_id
                        , element.EMER_START_DATE
                        , element.EMER_END_DATE
                        , element.EMER_START_TIME_HOURS
                        , element.EMER_START_TIME_MINS
                        , element.EMER_END_TIME_HOURS
                        , element.EMER_END_TIME_MINS
                        , (element.EMER_WEEK_OFF_START_DATE == "") ? null : element.EMER_WEEK_OFF_START_DATE
                        , (element.EMER_WEEK_OFF_END_DATE == "") ? null : element.EMER_WEEK_OFF_END_DATE
                        , element.FLAG
                        , util.getuserId(req.headers.authorization)
                    ]
                    , function (error, result) {
                        if (error) {
                            errorlogger.error(error, null);
                            response.return_code = 1;
                            response.return_message = "Error Saving Employee in Roster";
                            errorFlag = true;
                            reject();
                        } else {

                            var string = JSON.stringify(result);
                            var json = JSON.parse(string);

                            if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                if (index === array.length - 1) resolve();
                            }
                        }
                    });
            });

        });
        rosterempsave.then(() => {
            if (errorFlag) {
                connection.rollback();
                connection.release();
                callback(response);

            }
            else {
                connection.commit();
                connection.release();
                callback(response);
            }
            return;
        }).catch((error) => {
            errorlogger.error(error, null);
            connection.rollback();
            try {
                connection.release();
            }
            catch (ex) { }
            response.return_code = 1;
            response.return_message = "Error Saving Employee in Roster";
            callback(response);
            return;

        });
    },
    getProductivityReportData: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
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
                connection.query(config.hrms.getProductivityReportData,
                    [req.body.reportType,
                    new Date(req.body.startDate_year, req.body.startDate_month - 1, req.body.startDate_day),
                    new Date(req.body.endDate_year, req.body.endDate_month - 1, req.body.endDate_day),
                    req.body.userId,
                    req.body.resourceName,
                    req.body.daterange,
                    req.body.timezone,
                    req.body.company,
                    req.body.dept,
                    req.body.designation,
                    req.body.role,
                    req.body.manager,
                    req.body.managerName,
                    util.getuserId(req.headers.authorization)], function (err, rows) {
                        if (err) {
                            errorlogger.error(err);
                            response.return_message = "Error getting Report data for " + req.body.reportType;
                            response.return_code = 1;
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            logger.debug(rows);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        }

                    });
            }
        });
    },

};

