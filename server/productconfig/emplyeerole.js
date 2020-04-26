var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');
module.exports = {
    getEmployeeRoles: function (req,callback) {

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
                response.return_message = "Error getting Employee Role";
                connection.release();
                callback(response);

            }
            connection.query(config.product.getEmployeeRoles, [req.body.company_id, req.body.designation_id, util.getuserId(req.headers.token)], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    connection.release();
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Employee Role"
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
};