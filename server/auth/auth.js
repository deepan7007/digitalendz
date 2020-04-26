var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var passport = require('passport');
const logger = log4js.getLogger('logger');
const errorlogger = log4js.getLogger('errorlogger');
var path = require('path');

var util = require('../common/utility');


//TODO bcrypt is yet to be done: It will be done after Onboarding process completes

var auth = module.exports = {
    login: function (req, res) {
        if (req.body.email && req.body.password) {
            var IN_SERU_USER_ID = req.body.email;
            var IN_SEUS_PASSWORD = util.encrypt(req.body.password); //bcrypt.hashSync(req.body.password, config.auth.superSecret);
            logger.debug("hash is => " + IN_SEUS_PASSWORD);
            pool.getConnection(function (err, connection) {
                if (err) {
                    errorlogger.error("An error occurred: " + err);
                    connection.release();
                    return res.status(401).json({
                        data: {
                            error: 'Please contact system administrator !!',
                            redirect: {
                                success: '/auth/login',
                                failure: '/auth/login',
                            },
                        }
                    });
                }
                connection.query(config.auth.login, [IN_SERU_USER_ID, IN_SEUS_PASSWORD], function (err, result) {
                       if (err) {
                        logger.error(err);
                        errorlogger.error("An error occurred: " + err);
                        connection.release();
                        return res.status(401).json({
                            data: {
                                error: 'Please contact system administrator !!',
                                redirect: {
                                    success: '/auth/login',
                                    failure: '/auth/login',
                                },
                            }
                        });
                    }
                    else {
                        connection.release();
                        var json = JSON.parse(JSON.stringify(result));
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            var modules = [];
                            for (var i = 0; i < result[0].length; i++) {
                                let el = [result[0][i].MODULE, result[0][i].PATH, result[0][i].PARENT_TITLE, result[0][i].VISIBLE];
                                if (!modules.includes(el)) modules.push(el);
                            }
                            var payload = {
                                id: result[0][0].UID,
                                email: IN_SERU_USER_ID,
                                name: result[0][0].FULLNAME,
                                module: modules,
                            };
                            var token_payload = {
                                id: result[0][0].UID,
                                email: IN_SERU_USER_ID,
                                name: result[0][0].FULLNAME,
                            };
                            var token = jwt.sign(token_payload, config.auth.superSecret, {
                                expiresIn: 1800
                            });
                            res.json({
                                data: {
                                    token: token,
                                    payload: payload,
                                    redirect: {
                                        success: '/',
                                        failure: '/auth/login',
                                    },
                                }
                            });
                        }
                        else {
                            try {
                                connection.release();
                                res.status(401).json({
                                    data: {
                                        error: json[json.length - 1][0].return_message,
                                        token: null,
                                        redirect: {
                                            success: '/auth/login',
                                            failure: null,
                                        },
                                    },
                                });
                            }
                            catch (ex) {
                                res.status(401).json({
                                    data: {
                                        error: json[json.length - 1][0].return_message,
                                        token: null,
                                        redirect: {
                                            success: '/auth/login',
                                            failure: null,
                                        },
                                    },
                                });
                            }

                        }
                    }
                });
            });
        }
    },

    logout: function (req, res) {
        res.json({
            data: {
                message: "successfully logged out!",
                token: null,
                redirect: {
                    success: '/auth/login',
                    failure: null,
                },
            }
        });
    },


    saveLogin: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        var IN_DATE = null;
        var OUT_DATE = null;
        if (req.body.userId) {
            var IN_SERU_USER_ID = req.body.userId;
            var IN_SERU_USER_NAME = req.body.name;
            var IN_STATUS = req.body.status;
            if (IN_STATUS === "LOG IN" || IN_STATUS === "BREAK IN") { IN_DATE = req.body.date; } else {
                OUT_DATE = req.body.date;
            }
            pool.getConnection(function (err, connection) {
                if (err) {
                    errorlogger.error("An error occurred: " + err);
                    connection.release();
                    response.return_message = "Error getting DB connection"
                    response.return_code = 1
                    callback(response);
                }
                connection.query(config.auth.saveLogin, [IN_STATUS, OUT_DATE, IN_DATE, IN_SERU_USER_ID, IN_SERU_USER_NAME], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_message = "Error Updating Login/Break Status";
                        response.return_code = 1;
                        connection.release();
                        callback(response);
                        return;
                    }
                    else {
                        var string = JSON.stringify(rows);
                        var json = JSON.parse(string);
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            response.data = rows[0];
                            connection.release();
                            callback(response);
                            return;
                        } else {
                            response.return_code = json[json.length - 1][0].return_code;
                            response.return_message = json[json.length - 1][0].return_message;
                            connection.rollback();
                            connection.release();
                            callback(response);
                            return;
                        }
                    }
                });
            });
        }
    },

    getLoginDtls: function (req, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        var IN_SERU_USER_ID = req.query.userId;
        pool.getConnection(function (err, connection) {
            if (err) {
                errorlogger.error("An error occurred: " + err);
                connection.release();
                response.return_message = "Error getting DB connection"
                response.return_code = 1
                callback(response);
            }
            connection.query(config.auth.getLoginDtls, [IN_SERU_USER_ID], function (err, rows) {
                if (err) {
                    errorlogger.error(err);
                    connection.release();
                    response.return_code = 1;
                    response.return_message = "Error Retrieving Login Details"
                    callback(response);
                    return;
                    //throw err;
                } else {
                    //var string = ;
                    response.data = JSON.parse(JSON.stringify(rows[0]));
                    connection.release();
                    callback(response);
                    return;
                }
            });

        });
    },

    changePassword: function (req, res) {

        if (req.body.email && req.body.oldPassword) {
            var IN_SERU_USER_ID = req.body.email;
            var IN_SEUS_PASSWORD = util.encrypt(req.body.oldPassword);//bcrypt.hashSync(req.body.oldPassword, config.auth.superSecret);
            var IN_SEUS_NEW_PASSWORD = util.encrypt(req.body.password);//bcrypt.hashSync(req.body.password, config.auth.superSecret);

            pool.getConnection(function (err, connection) {
                if (err) {
                    errorlogger.error("An error occurred: " + err);
                    connection.release();
                    return res.status(401).json({
                        data: {
                            error: 'Please contact system administrator !!',
                            redirect: {
                                success: '/auth/login',
                                failure: '/auth/login',
                            },
                        }
                    });
                }
                connection.query(config.auth.changePassword, [IN_SERU_USER_ID, IN_SEUS_PASSWORD, IN_SEUS_NEW_PASSWORD], function (err, result) {
                    if (err) {
                        errorlogger.error("An error occurred: " + err);
                        connection.release();
                        return res.status(401).json({
                            data: {
                                error: 'Please contact system administrator !!',
                                redirect: {
                                    success: '/auth/login',
                                    failure: '/auth/login',
                                },
                            }
                        });
                    }
                    else {
                        connection.release();
                        var json = JSON.parse(JSON.stringify(result));
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            res.json({
                                data: {
                                    message: json[json.length - 1][0].return_message,
                                    token: null,
                                    // redirect: {
                                    //     success: '/auth/login',
                                    //     failure: null,
                                    // },
                                },
                            });
                        }
                        else {
                            res.status(401).json({
                                data: {
                                    error: json[json.length - 1][0].return_message,
                                    token: null,
                                    redirect: {
                                        success: '/auth/login',
                                        failure: null,
                                    },
                                },
                            });
                        }
                    }
                });
            });
        }
    },
    forgotPassword: function (req, res) {
        //TODO

        if (req.body.email && req.body.password) {
            logger.debug("Update Password");
            var IN_SERU_USER_ID = req.body.email;
            var IN_SEUS_NEW_PASSWORD = util.encrypt(req.body.password);//bcrypt.hashSync(req.body.password, config.auth.superSecret);
            logger.debug("UPdate passwd" + IN_SEUS_NEW_PASSWORD);
            pool.getConnection(function (err, connection) {
                if (err) {
                    errorlogger.error("An error occurred: ");
                    errorlogger.error(err);
                    connection.release();
                    return res.status(401).json({
                        data: {
                            error: 'Please contact system administrator !!',
                            redirect: {
                                success: '/auth/login',
                                failure: '/auth/login',
                            },
                        }
                    });
                }

                connection.query(config.usersSQL.resetPassword, [null
                    , IN_SERU_USER_ID
                    , IN_SEUS_NEW_PASSWORD
                    , null
                ], function (err, result) {
                    if (err) {
                        errorlogger.error("An error occurred: ");
                        errorlogger.error(err);
                        connection.release();
                        return res.status(401).json({
                            data: {
                                error: 'Please contact system administrator !!',
                                redirect: {
                                    success: '/auth/login',
                                    failure: '/auth/login',
                                },
                            }
                        });
                    }
                    else {
                        connection.release();
                        var json = JSON.parse(JSON.stringify(result));
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            res.json({
                                data: {
                                    message: json[json.length - 1][0].return_message,
                                    token: null,
                                },
                            });
                        }
                        else {
                            connection.release();
                            res.status(401).json({
                                data: {
                                    error: json[json.length - 1][0].return_message,
                                    token: null,
                                    redirect: {
                                        success: '/auth/login',
                                        failure: null,
                                    },
                                },
                            });
                        }
                    }
                });
            });
        }
        else {
            var IN_SERU_USER_ID = req.body.email;
            pool.getConnection(function (err, connection) {
                if (err) {
                    errorlogger.error("An error occurred: ");
                    errorlogger.error(err);
                    connection.release();
                    return res.status(401).json({
                        data: {
                            error: 'Please contact system administrator !!',
                            redirect: {
                                success: '/auth/login',
                                failure: '/auth/login',
                            },
                        }
                    });
                }
                connection.query(config.auth.forgotPassword, [IN_SERU_USER_ID], function (err, result) {
                    if (err) {
                        errorlogger.error("An error occurred: ");
                        errorlogger.error(err);
                        connection.release();
                        return res.status(401).json({
                            data: {
                                error: 'Please contact system administrator !!',
                                redirect: {
                                    success: '/auth/forgot-password',
                                    failure: '/auth/forgot-password',
                                },
                            }
                        });
                    }
                    else {
                        connection.release();
                        var json = JSON.parse(JSON.stringify(result));
                        if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                            var payload = {
                                email: IN_SERU_USER_ID,
                            };
                            var token = jwt.sign(payload, config.auth.superSecret, {
                                expiresIn: 10
                            });
                            /*var msg = {
                                to: IN_SERU_USER_ID,
                                from: 'System@NeuralFront.com',
                                html: '<div><h3>Dear Neural Front User,</h3><br><br><p>We have received your request for reset password. <br> kindly use this <b><a href=http://localhost:4200/#/auth/forgot-password?tokenKey=?>LINK</a></b> to reset your password</p><br><br>This link is valid for two hours from your request initiation for password recovery.<br><br> Thanks, <br> Neural Front Admin System <br><br>Note: This is a system generated e-mail, please do not reply to it. <br><br><br>*** This message is intended only for the person or entity to which it is addressed and may contain confidential and/or privileged information. If you have received this message in error, please notify the sender immediately and delete this message from your system ***</div>',
                                subject: 'Neural Front Password Reset Request',

                            };
                            */
                            util.sendEmail('RESETPASSWORD', IN_SERU_USER_ID, [token]);
                            //util.sendEmail(msg);
                            // smtpTransport.sendMail(msg, function (err) {

                            //    if (!err) {
                            //        return res.json({ message: 'Kindly check your email for further instructions' });
                            //    } else {
                            //        return res.json({
                            //            data: {
                            //                message: "Email Send Failure",
                            //            },
                            //        });
                            //    }
                            //});
                        }
                        else {
                            res.status(401).json({
                                data: {
                                    error: json[json.length - 1][0].return_message,
                                    token: null,
                                    redirect: {
                                        success: '/auth/forgot-password',
                                        failure: null,
                                    },
                                },
                            });
                        }
                    }
                });
            });
        }
    },
};
