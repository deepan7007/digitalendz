var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var generator = require('generate-password');
var dateFormat = require('dateformat');
const logger = log4js.getLogger('Leave');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility')

module.exports = {
    searchLeave: function (req, callback) {
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
                response.return_message = "Error Searching Leave Dashboard";
                connection.release();

            }
            logger.debug(req.body.leave);
            connection.query(config.onBoard.searchLeave,
                [
                  //  0,'','',null,null,null,'','1576'
                req.body.leave.EMLD_ID,
                req.body.leave.EMPH_ID,
                req.body.leave.EMLD_TYPE,                
                dateFormat(req.body.leave.EMLD_APPLIED_DT, "yyyy-mm-dd"),
                dateFormat(req.body.leave.EMLD_FROM_DT, "yyyy-mm-dd"),
                dateFormat(req.body.leave.EMLD_TO_DT, "yyyy-mm-dd"),                
                req.body.leave.EMLD_STATUS,                                            
                util.getuserId(req.headers.token), //EMPH_MANAGER_ID 
                req.body.leave.ROOSTER_DT_RANGE
                ], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        connection.release();
                        response.return_code = 1;
                        response.return_message = "Error Retrieving Leave List"
                        callback(response);
                        //throw err;
                    } else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        logger.debug(json);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            logger.debug(rows[0]);
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                        }
                        else {
                            logger.debug(json[json.length - 1][0].return_message);
                            logger.debug(json[json.length - 1][0].return_code);
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.release();
                            callback(response);
                        }

                    }

                });
        });
    },
   
}