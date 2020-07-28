var log4js = require('../config/log4j');
const logger = log4js.getLogger('opportunity');
const errorlogger = log4js.getLogger('errorlogger');

var mysql = require('mysql');
var jwt_decode = require('jwt-decode');
var pool = require('../common/DbConnection');

  //Project Management - Opportunity 
var saveOpportunitySP = "CALL projectmanagment.PJMSP_PMOP_OPPORTUNITIES_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
var getOpportunityListSP = 'CALL projectmanagment.PJMSP_PMOP_OPPORTUNITIES_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
var getOpportunitySP = 'call projectmanagment.PJMSP_PMOP_OPPORTUNITIES_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';

module.exports = {

    //post call to save the opportunity
    saveOpportunity: function (req, callback) {
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

            connection.query(saveOpportunitySP, [
                req.body.PMOP_ID,
                req.body.PMOP_NAME,
                req.body.PMOP_COMPANY,
                req.body.PMOP_REVENUE,
                req.body.PMOP_REVENUE_TYPE,
                req.body.PMOP_OWNER,
                req.body.PMOP_OWNER_ID,
                req.body.PMPRJ_PM_ID,
                req.body.PMOP_EXPECTED_START_DATE,
                req.body.PMOP_EXPECTED_END_DATE,
                req.body.PMOP_STATUS,
                req.body.PMOP_CUSTOMER_NAME,
                req.body.PMOP_CUSTOMER_PHONE,
                req.body.PMOP_PROSPECT_FOR_NEXT,
                req.body.PMOP_REFERRAL_OUTSIDE_SOURCE,
                req.body.PMOP_REFERRAL_NAME,
                req.body.PMOP_COMMENTS,
                jwt_decode(req.headers.authorization).email,
            ]
                , function (error, result) {
                    if (error) {
                        errorlogger.error(error, null);
                        connection.rollback();
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Saving Opportunity";
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

    //get call to list all the opportunity
    getOpportunityList: function (req, callback) {
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
                response.return_message = "Error in fetching Opportunity Details";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            errorlogger.error(jwt_decode(req.headers.authorization).email);
            connection.query(getOpportunityListSP, [jwt_decode(req.headers.authorization).email], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in fetching Opportunity Details";

                } else {
                    response.data = rows[0];
                }
                connection.release();
                callback(response);
                return;

            });

        });
    },
    //post call to search the opportunity

    searchOpportunity: function (req, callback) {
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
                response.return_message = "Error in fetching OpportunityDetails";
                connection.rollback();
                connection.release();
                callback(response);
                return;
            }
            connection.query(getOpportunitySP, [req.body.PMOP_ID, jwt_decode(req.headers.authorization).email], function (err, rows) {
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