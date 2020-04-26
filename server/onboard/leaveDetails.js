var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
var dateFormat = require('dateformat');
var util = require('../common/utility');
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');

module.exports = {

    saveLeaveDetails: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "Success",
            data: []
        }        
        pool.getConnection(function (err, connection) { 
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error gettign DB Conneciton";
                callback(response);
                return;
            }

            connection.beginTransaction();           
            
            connection.query(config.onBoard.saveLeaveDetails, [
                req.body.numOfDays,
                dateFormat(req.body.leaveStartDate, "yyyy-mm-dd h:MM:ss"),
                req.body.emldID,
                req.body.leaveReason,
                'Pending',
                dateFormat(req.body.leaveEndDate, "yyyy-mm-dd h:MM:ss"),
                req.body.leavetype,
                util.getuserId(req.headers.token),
                util.getuserId(req.headers.token)], function (err, result){
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Occcured while saving Leave details";
                        try {
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }
                        catch (ex) {
                            errorlogger.log(ex)
                            callback(response);
                            return;
                        }

                    } else {
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);

                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            response.return_code = 0;
                            response.data = [{ EMLD_ID: json[0][0].EMLD_ID }];
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.commit();
                            connection.release();
                            callback(response);
                            return;
                        }
                        else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(json[json.length - 1][0].return_message);
                            try {
                                connection.rollback();
                                connection.release();
                                callback(response);
                                return;
                            }
                            catch (ex) {
                                errorlogger.log(ex)
                                callback(response);
                                return;
                            }
                        }
                    }

                });
        });     
    },

    saveLeaveStatusDetails: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "Success",
            data: []
        }
        pool.getConnection(function (err, connection) { 
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error gettign DB Conneciton";
                connection.release();
                callback(response);                
            }
            connection.beginTransaction();           
            connection.query(config.onBoard.saveLeaveStatusDetails, [               
                req.body.emld_id,
                '',
                util.getuserId(req.headers.token),
                req.body.status_code], function (err, result){
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Occcured while updating Leave status";
                        try {
                            connection.rollback();
                            connection.release();                          
                        }
                        catch (ex) {
                            errorlogger.log(ex)                            
                        }
                        callback(response);
                    } else {
                        try {
                            connection.commit();
                            connection.release();
                            callback(response); 
                        }
                        catch (ex) {
                            errorlogger.err(ex);
                            callback(response);
                        }
                        response.data = result[0];                                         
                    }
                });
        });
    }

    /*saveLeaveStatusDetails: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "Success",
            data: []
        }
        pool.getConnection(function (err, connection) { 
            if (err) {
                errorlogger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error gettign DB Conneciton";
                callback(response);
                return;
            }
            connection.beginTransaction();           
            connection.query(config.onBoard.saveLeaveStatusDetails, [               
                req.body.emld_id,
                '',
                util.getuserId(req.headers.token),
                req.body.status_code], function (err, result){
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error Occcured while updating Leave status";
                        try {
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }
                        catch (ex) {
                            errorlogger.log(ex)
                            callback(response);
                            return;
                        }

                    } else {
                        var string = JSON.stringify(result);
                        var json = JSON.parse(string);

                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            response.return_code = 0;
                            response.data = [{ EMLD_ID: json[0][0].EMLD_ID }];
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.commit();
                            connection.release();
                            callback(response);
                            return;
                        }
                        else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            errorlogger.error(json[json.length - 1][0].return_message);
                            try {
                                connection.rollback();
                                connection.release();
                                callback(response);
                                return;
                            }
                            catch (ex) {
                                errorlogger.log(ex)
                                callback(response);
                                return;
                            }
                        }
                    }

                });
        });     
    }*/

}