var express = require('express');
var router = express.Router();

var pool = require('./common/DbConnection');
var config = require('./config/config');
var log4js = require('./config/log4j');
var personalDetails = require('./onboard/personalDetails.js');
var addressDetails = require('./onboard/addressDetails.js');
var educationDetails = require('./onboard/educationDetails');
var employmentDetails = require('./onboard/employmentDetails');
var attachmentDetails = require('./onboard/attachmentDetails');
var leaveDetails = require('./onboard/leaveDetails');
var leave = require('./onboard/leave');
var employee  = require('./onboard/Employee');
var onboard = require('./onboard/onboard');
var roster = require('./onboard/roster');


const errorlogger = log4js.getLogger('errorlogger');

router.post('/api/getProductivityReportData', (req, res) => {
  try {
    roster.getProductivityReportData(req, function (result) {
      res.status(result.status);
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }


});

router.get('/api/getRosterList', (req, res) => {
  try {
    roster.getRosterList(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.get('/api/getRoster', (req, res) => {
  try {
    roster.getRoster(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});
router.post('/api/saveRoster', (req, res) => {
  try {
    roster.saveRoster(req, function (result) {
      res.json(result);
    });
  }
  catch (error) {
    throw error;
  }
});

router.post('/api/saveEmpPersonalDetails', (req, res) => {
    try {
      personalDetails.savePersonalDetails(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });

  router.post('/api/saveAddressDetails', (req, res) => {
    try {
      addressDetails.saveAddressDetails(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.post('/api/saveEducationDetails', (req, res) => {
    try {
      educationDetails.saveEducationDetails(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.post('/api/saveEmploymentDetails', (req, res) => {
    try {
      employmentDetails.saveEmploymentDetails(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });

  router.post('/api/searchEmployee', (req, res) => {
    try {
      employee.searchEmployee(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.post('/api/employeeSearch', (req, res) => {
    try {
      employee.employeeSearch(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  
  router.get('/api/getPersonalDetails', (req, res) => {
    try {
      personalDetails.getPersonalDetails(req,req.query.emp_id, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.get('/api/getAddressDetails', (req, res) => {
    try {
      addressDetails.getAddressDetails(req,req.query.emp_id, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.get('/api/getEducationDetails', (req, res) => {
    try {
      educationDetails.getEducationDetails(req,req.query.emp_id, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.get('/api/getEmploymentDetails', (req, res) => {
    try {
      employmentDetails.getEmploymentDetails(req,req.query.emp_id, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.post('/api/saveAttachmentDetails', (req, res) => {
    try {
      attachmentDetails.saveAttachmentDetails(req, res, function (result) {
        res.status(result.status);
        res.json(result);
        //res.end('File is uploaded');
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.post('/api/deleteAttachment', (req, res) => {
    try {
      attachmentDetails.deleteAttachment(req, res, function (result) {
        res.status(result.status);
        res.json(result);
        //res.end('File is uploaded');
      });
    }
    catch (error) {
      throw error;
    }
  });
  
  router.get('/api/getAttachmentDetails', (req, res) => {
    try {
      attachmentDetails.getAttachmentDetails(req,req.query.emp_id, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });
  router.get('/api/getMetaData', (req, res) => {
    try {
      onboard.getMetaData(req,function (result) {
        res.json(result);
        
      });
    }
    catch (error) {
      throw error;
    }
  
  });

  router.post('/api/getAttachmentContent', (req, res) => {
    try {
      //res.download(req.body.filepath);
      res.sendFile(req.body.filepath);
      /*attachmentDetails.getAttachmentContent(req,res, function (result) {
        res.status(result.status);
        res.json(result);
      });*/
    }
    catch (error) {
      errorlogger.error(error);
      res.json("error");
    }
  });

  router.post('/api/saveLeaveDetails', (req, res) => {
    try {
      leaveDetails.saveLeaveDetails(req,function (result) {
        res.status(result.status);
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });

  router.post('/api/searchLeave', (req, res) => {
    try {
      leave.searchLeave(req, function (result) {
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });

  router.post('/api/saveLeaveStatusDetails', (req, res) => {
    try {
      leaveDetails.saveLeaveStatusDetails(req,function (result) {
        res.status(result.status);
        res.json(result);
      });
    }
    catch (error) {
      throw error;
    }
  });

  module.exports = router;