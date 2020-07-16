var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
const logger = log4js.getLogger('project');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {

    //post call to save the project
    saveProject: function (req, callback) {
        console.log('**************** ');
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
                response.return_message = "Error Saving User";
                connection.release();
                callback(response);
                return;
            }

            connection.beginTransaction();
            var PMOP_CREATED_BY = "TestUser";

            connection.query(config.project.saveProject, [
                req.body.PMPRJ_ID,
                req.body.PMOP_ID,
                req.body.PMPRJ_NAME,
                req.body.PMPRJ_PM,
                req.body.PMPRJ_REVENUE,
                req.body.PMPRJ_COST_SPENT,
                req.body.PMPRJ_CP_PERCENTAGE,
                req.body.PMPRJ_START_DATE,
                req.body.PMPRJ_END_DATE,
                PMOP_CREATED_BY,
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
                            // logger.error("Iteration: " + i + ": " + json[json.length - 1][0].return_message);
                            connection.rollback();
                            connction.release();
                            callback(response);
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

    //get call to list all the project
    getProjectList: function (req, callback) {
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
            connection.query(config.project.getProjectList, ['UserTest'], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in fetching the project Details";

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

    searchProject: function (req, callback) {
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
            console.log(config.project.getProject, [req.body.PMPRJ_ID, 'TestUser']);
            connection.query(config.project.getProject, [req.body.PMPRJ_ID, 'TestUser'], function (err, rows) {
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

}