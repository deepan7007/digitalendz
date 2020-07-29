var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
const logger = log4js.getLogger('opportunityWorklog');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {
    
    saveOpportunityWorklog: function (req, callback) {
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

                connection.query(config.opportunityWorklog.saveOpportunityWorklog, [
                    req.body.PMOP_ID,
                    req.body.PMOP_REFERRAL,
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
                            logger.error("HERE &&&&& "+ string);
                            errorlogger.error("^^^^####^^^^^"+ json);
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

                            // }
                            // else {
                                // next();
                            // }
                        

                        }

                    });

        });
    },

  
    //post call to search the opportunity

    getOpportunityWorklog: function (req, callback) {
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
            connection.query(config.opportunityWorklog.getOpportunityWorklog,[req.body.PMOP_ID,'TestUser'], function (err, rows) {
                if (err) {
                    errorlogger.error(err); 
                    response.return_code = 1;
                    response.return_message = "Error in retriving the Opportunity Details";
                } else {
                    response.data = rows[0];
                }
                connection.release();
                callback(response);
                return;
            });

        });
    },

}