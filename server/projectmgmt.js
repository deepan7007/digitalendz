var express = require('express');
var router = express.Router();

var log4js = require('./config/log4j');
var opportunity = require('./projectmgmt/opportunity.js');
var opportunityWorklog = require('./projectmgmt/opportunityWorklog.js');
var project = require('./projectmgmt/project.js');
var expense = require('./projectmgmt/expenses.js');
var invoice = require('./projectmgmt/invoice.js');
var projectAttachment = require('./projectmgmt/projectAttachment.js');

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
    opportunity.searchOpportunity(req, function (result) {
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

//project - starts here 

router.post('/api/saveProject', (req, res) => {
  try {
    project.saveProject(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    errorlogger.error(error);
    throw error;
  }
});

router.get('/api/getProjects', (req, res) => {
  try {
    project.getProjectList(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchProject', (req, res) => {
  try {
    project.searchProject(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchProjectByOpportunity', (req, res) => {
  try {
    project.searchProjectByOpportunity(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});


//Expenses - starts here 

router.post('/api/saveExpenses', (req, res) => {
  try {
    expense.saveExpense(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    errorlogger.error(error);
    throw error;
  }
});

router.get('/api/getExpenses', (req, res) => {
  try {
    expense.getExpenseList(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchExpense', (req, res) => {
  try {
    expense.searchExpense(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/deleteExpense', (req, res) => {
  try {
    expense.deleteExpense(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchExpensesByProject', (req, res) => {
  try {
    expense.searchExpenseByProject(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

//project Attachment starts
router.post('/api/saveProjectAttachmentDetails', (req, res) => {
  try {
    projectAttachment.saveAttachmentDetails(req, res, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.get('/api/getProjectAttachmentDetails', (req, res) => {
  try {
    projectAttachment.getAttachmentDetails(req, req.query.PMPRJ_ID, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/deleteProjectAttachment', (req, res) => {
  try {
    projectAttachment.deleteAttachment(req, res, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});


//Invoices - starts here 

router.post('/api/saveInvoices', (req, res) => {
  try {
    invoice.saveInvoice(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    errorlogger.error(error);
    throw error;
  }
});

router.get('/api/getInvoices', (req, res) => {
  try {
    invoice.getInvoiceList(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchInvoice', (req, res) => {
  try {
    invoice.searchInvoice(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/deleteInvoice', (req, res) => {
  try {
    invoice.deleteInvoice(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/searchInvoicesByProject', (req, res) => {
  try {
    invoice.searchInvoiceByProject(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});


module.exports = router;