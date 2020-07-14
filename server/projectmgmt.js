var express = require('express');
var router = express.Router();

var log4js = require('./config/log4j');
var opportunity = require('./projectmgmt/opportunity.js');
var opportunityWorklog = require('./projectmgmt/opportunityWorklog');

const errorlogger = log4js.getLogger('errorlogger');

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


router.post('/api/saveOpportunity', (req, res) => {
  try {
    opportunity.saveOpportunity(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    errorlogger.error(error);
    throw error;
  }
});

router.get('/api/getOpportunities', (req, res) => {
  try {
    opportunity.getOpportunityList(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchOpportunity', (req, res) => {
  try {
    opportunity.seatchOpportunity(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

//Worklog - starts here 

router.post('/api/saveOpportunityWorklog', (req, res) => {
  try {
    opportunityWorklog.saveOpportunityWorklog(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/searchOpportunityWorklog', (req, res) => {
  try {
    opportunityWorklog.getOpportunityWorklog(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});


module.exports = router;