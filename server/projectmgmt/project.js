var pool = require('../common/DbConnection');
var config = require('../config/config');
var log4js = require('../config/log4j');
const logger = log4js.getLogger('project');
const errorlogger = log4js.getLogger('errorlogger');
var util = require('../common/utility');

module.exports = {

    //post call to save the project
    saveProject: function (req, callback) {
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
                req.body.PMPRJ_PM_ID,
                req.body.PMPRJ_STATUS,
                req.body.PMPRJ_REVENUE,
                req.body.PMPRJ_CURRENCY,
                req.body.PMPRJ_COST_SPENT,
                req.body.PMPRJ_START_DATE,
                req.body.PMPRJ_END_DATE,
                util.getuserId(req.headers.authorization)
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
            connection.query(config.project.getProjectList, [util.getuserId(req.headers.authorization)], function (err, rows) {
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
            connection.query(config.project.getProject, [req.body.PMPRJ_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
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

     //post call to search the project by Opportunity

     searchProjectByOpportunity: function (req, callback) {
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
            connection.query(config.project.searchProject, [req.body.PMOP_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
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

// project Attachment
    saveAttachmentDetails: function (req, res, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }
        try {
            var emp_id = "";
            var DcoumentType = "";
            var location = "";
            var originalFilename = "";
            var upload = multer(
                {
                    storage: multer.diskStorage({
                        destination: function (req, file, cb) {
                            try {
                                logger.debug("From filename");
                                logger.debug(req.body);
                                logger.debug(file);
                                if (!fs.existsSync(DIR)) {
                                    fs.mkdirSync(DIR);
                                }
                                cb(null, DIR);
                            }
                            catch (err) {
                                cb(err);
                            }
                        },
                        filename: function (req, file, cb) {
                            try {
                                var filename = req.body.EMP_ID + "\_"
                                    + path.basename(file.originalname, path.extname(file.originalname))
                                    + '_' + Date.now() + path.extname(file.originalname);
                                var fileFullPath = path.resolve(DIR) + "\\" + filename;
                                DcoumentType = req.body.DcoumentType;
                                emp_id = req.body.EMP_ID;
                                location = fileFullPath;
                                originalFilename = file.originalname
                                cb(null, filename)
                            }
                            catch (err) {
                                //throw (err);
                                cb(err);
                            }
                        }
                    })
                }).single('file');
            upload(req, res, function (err) {
                try {
                    if (err) {
                        // An error occurred when uploading
                        console.log(err);
                        return res.status(422).send("an Error occured")
                    }
                    // No error occured.
                    pool.getConnection(function (err, connection) {
                        if (err) {
                            logger.error("An error occurred: " + err);
                            fs.unlink(location, function (err) {
                                if (err) {
                                    //ignore error
                                };
                                // if no error, file has been deleted successfully
                                response.return_code = 1;
                                response.status = 501;
                                response.return_message = "Error uploading file.";
                                logger.error("Error uploading file.")
                                logger.error(err)
                                callback(response);
                            });
                        }
                        else {
                            connection.beginTransaction();
                            connection.query(config.onBoard.saveAttachmentDetails,
                                [null,
                                    emp_id,
                                    originalFilename,
                                    DcoumentType,
                                    location,
                                    "I",
                                    util.getuserId(req.headers.authorization)], function (err, result) {
                                        try {
                                            if (err) {
                                                errorlogger.error(err);
                                                fs.unlink(location, function (err) {
                                                    if (err) {
                                                        //ignore error
                                                    };
                                                    // if no error, file has been deleted successfully
                                                    response.return_code = 1;
                                                    response.return_message = "Error uploading file.";
                                                    logger.error("Error uploading file.")
                                                    logger.error(err)
                                                    try {
                                                        connection.rollback();
                                                        connection.release();
                                                        callback(response);
                                                    }
                                                    catch (err) {
                                                        //ignore error
                                                        callback(response);
                                                    }

                                                });
                                            } else {
                                                var string = JSON.stringify(result);
                                                var json = JSON.parse(string);
                                                if (json[json.length - 1][0].return_code == null || json[json.length - 1][0].return_code == 0) {
                                                    connection.commit();
                                                    connection.query(config.onBoard.getAttachmentDetails, [emp_id, util.getuserId(req.headers.authorization)], function (err, rows) {
                                                        if (err) {
                                                            errorlogger.error(err);
                                                            response.return_code = 1;
                                                            response.return_message = "Error getting attachment details.";
                                                            connection.release();
                                                            callback(response);
                                                        } else {
                                                            logger.debug(rows);
                                                            response.data = rows[0];
                                                            connection.release();
                                                            callback(response);
                                                        }

                                                    });
                                                }
                                                else {
                                                    response.return_code = json[json.length - 1][0].return_code;
                                                    response.return_message = json[json.length - 1][0].return_message;
                                                    errorlogger.error(json[json.length - 1][0].return_message);
                                                    connection.rollback();
                                                    connection.release();
                                                    callback(response);
                                                }
                                            }
                                        }
                                        catch (ex) {
                                            fs.unlink(location, function (err) {
                                                if (err) {
                                                    //ignore error
                                                };
                                                // if no error, file has been deleted successfully
                                                response.return_code = 1;
                                                response.return_message = "Error uploading file.";
                                                logger.error("Error uploading file.")
                                                logger.error(ex)
                                                callback(response);
                                            });

                                        }
                                    });


                        }
                    });

                }
                catch (ex) {
                    response.return_code = 1;
                    response.return_message = "Error uploading file.";
                    logger.error("Error uploading file.")
                    logger.error(ex)
                    callback(response);
                }
            });


        }
        catch (ex) {
            response.return_code = 1;
            response.return_message = "Error uploading file.";
            logger.error("Error uploading file.")
            logger.error(ex)

            callback(response);
        }




    },
    getAttachmentDetails: function (req, IN_EMP_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error getting attachment details.";
                connection.release();

                callback(response);

            }
            else {
                logger.error(err);
                connection.query(config.onBoard.getAttachmentDetails, [IN_EMP_ID], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error getting attachment details.";
                        connection.release();
                        callback(response);
                    } else {
                        logger.debug(rows);
                        response.data = rows[0];
                        connection.release();
                        callback(response);
                    }

                });
            }
        });
    },
    getAttachmentDetails: function (req, IN_EMP_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error getting attachment details.";
                connection.release();
                callback(response);

            }
            else {
                logger.error(err);
                connection.query(config.onBoard.getAttachmentDetails, [IN_EMP_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
                    if (err) {
                        errorlogger.error(err);
                        response.return_code = 1;
                        response.return_message = "Error getting attachment details.";
                        connection.release();
                        callback(response);
                    } else {
                        logger.debug(rows);
                        response.data = rows[0];
                        connection.release();
                        callback(response);
                    }
                });
            }
        });
    },
    deleteAttachment: function (req, IN_EMP_ID, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }


        pool.getConnection(function (err, connection) {

            if (err) {

                logger.error("An error occurred: " + err);
                response.return_code = 1;
                response.return_message = "Error getting attachment details.";
                connection.release();
                callback(response);

            }
            else {
                fs.unlink(req.body.EMAT_ATTACHMENT_LOCATION, function (err) {
                    if (err) {
                        // if no error, file has been deleted successfully
                        response.return_code = 1;
                        response.return_message = "Error Deleting file.";
                        logger.error("Error Deleting file.")
                        logger.error(err)
                        connection.release();
                        callback(response);
                    }
                    else {
                        connection.beginTransaction();
                        connection.query(config.onBoard.deleteAttachment, [req.body.EMP_ID, req.body.EMAT_ID, util.getuserId(req.headers.authorization)], function (err, rows) {
                            if (err) {
                                errorlogger.error(err);
                                response.return_code = 1;
                                response.return_message = "Error Deleting file.";
                                try {
                                    connection.rollback();
                                    connection.release();
                                }
                                catch (ex) {
                                    errorlogger.err(ex);
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
                                logger.debug(rows);
                                response.data = rows[0];

                            }
                        });
                    }

                });

            }
        });
    },
    getAttachmentContent: function (req, res, callback) {
        let response = {
            status: 200,
            return_code: 0,
            return_message: "",
            data: []
        }

        try {
            let fileData = fs.readFileSync(req.body.filepath, 'utf8');
            if (fileData.length != 0) {
                response.data = fileData;
                callback(response);
            }
            
           
        }
        catch (err) {
            errorlogger.error(err);
            callback(response);
        }
    },
}