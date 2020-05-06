var express = require('express');
var router = express.Router();
var pool = require('./common/DbConnection');
var config = require('./config/config');
var log4js = require('./config/log4j');
var metadata = require('./productconfig/metadata.js');
var company = require('./productconfig/company.js');
var department = require('./productconfig/department.js');
var designation = require('./productconfig/designation.js');
var employeerole = require('./productconfig/emplyeerole.js');
var shift = require('./productconfig/shift.js');
var attachment = require('./productconfig/attachment.js')
var auth = require('./auth/auth.js');

const logger = log4js.getLogger('logger');

let response = {
  status: 200,
  message: null,
  data: []
}
var sendError = (err, res) => {
  response.status = 501;
  respnse.message = typeof err == "object" ? err.message : err;
  res.status(501).json(respnse);
}
router.get('/api/getMetaDataList', (req, res) => {
  try {
    metadata.getMetaDataList(function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/getCompanies', (req, res) => {
  try {
    company.getCompanies(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/getShiftsList', (req, res) => {
  try {
    shift.getShiftsList(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/getAttachmentLocation', (req, res) => {
  try {
    attachment.getAttachmentLocation(req,res,function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/getShift', (req, res) => {
  try {
    shift.getShift(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/saveShift', (req, res) => {
  try {
    shift.saveShift(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/getDepartment', (req, res) => {
  try {
    department.getDepartment(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/getDesignation', (req, res) => {
  try {
    designation.getDesignation(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/getEmployeeRoles', (req, res) => {
  try {
    employeerole.getEmployeeRoles(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/deletaMetaData', (req, res) => {
  try {
    metadata.deleteMetaData(req, res, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/saveMetaDataDetails', (req, res) => {
  try {
    metadata.saveMetaDataDetails(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
module.exports = router;