var express = require('express');
var router = express.Router();
var child = require('child_process');

var config = require('./config/config');
var log4js = require('./config/log4j');
var hyperloop = require('./hyperloop/hyperloop.js');
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

router.post('/api/getConfig', (req, res) => {
  try {
    hyperloop.getConfig(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/updateConfig', (req, res) => {
  try {
    hyperloop.updateConfig(req, function (result) {      
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/insertConfig', (req, res) => {
  try {
    hyperloop.insertConfig(req, function (result) {      
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/getAccountSettings', (req, res) => {
  try {
    hyperloop.getAccountSettings(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/updateAccountSettings', (req, res) => {
  try {
    hyperloop.updateAccountSettings(req, function (result) {      
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/insertAccount', (req, res) => {
  try {
    hyperloop.insertAccount(req, function (result) {      
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/getHyperorderData', (req, res) => {
  try {
    hyperloop.getHyperorderData(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/getHyperorderDataSummary', (req, res) => {
  try {
    hyperloop.getHyperorderDataSummary(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});



module.exports = router;