var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');

const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');

module.exports = {
    getAttachmentLocation: function (req,res,callback) {
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
            connection.query(config.product.getAttachmentLocation, [
                    req.query.type,
                    req.query.name,
                    util.getuserId(req.headers.authorization)
            ], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    response.return_code = 1;
                    response.return_message = "Error in Meta Data Details";
                    connection.release();
                    callback(response);
                } else {
                    logger.debug(rows);
                    response.data = rows[0];
                    connection.release();
                    callback(response);
                }
            });

        });
    },

};