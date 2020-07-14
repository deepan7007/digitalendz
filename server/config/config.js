var config = {};
config.dbconcfig = {};
config.rolesSQL = {};
config.modulesSQL = {};
config.usersSQL = {};
config.auth = {};
config.onBoard = {};
config.hrms = {};
config.common = {};
config.product = {};
config.system = {};
config.opportunity = {};
config.opportunityWorklog = {};

//DB Configuration
config.dbconcfig.host = '18.144.103.62';
config.dbconcfig.user = 'digitalentz';
config.dbconcfig.password = 'digitalentz';
config.dbconcfig.database = 'system';

// config.dbconcfig.host = '96.31.67.95';
// config.dbconcfig.user = 'neuralfront';
// config.dbconcfig.password = 'neuralfront';
// config.dbconcfig.database = 'system';

//product SQL
config.product.getCompanies = "CALL product.PRDSP_PRCM_COMPANY_LIST(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.product.getDepartment = "CALL product.PRDSP_PRDT_DEPARTMENT_LIST(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.product.getDesignation = "CALL product.PRDSP_PRED_EMPLOYEE_DESIGNATION_LIST(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.product.getEmployeeRoles = "CALL product.PRDSP_PRER_EMPLOYEE_ROLE_LIST(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.product.getShiftsList = "CALL product.PRDSP_PRSH_SHIFT_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.product.getShift = "CALL product.PRDSP_PRSH_SHIFT_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.product.saveShift = "CALL product.PRDSP_PRSH_SHIFT_APPLY(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.product.getMetadataFromTable = "CALL product.PRDSP_METADATA_GET(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.hrms.getRosterList = "CALL hrms.HRMSP_EMRS_ROSTER_SEARCH(?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.hrms.getRoster = "CALL hrms.HRMSP_EMRS_ROSTER_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.hrms.saveRoster = "CALL hrms.HRMSP_EMRS_ROSTER_APPLY(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.hrms.saveEmployeeRoster = "CALL hrms.HRMSP_EMER_EMPLOYEE_ROSTER_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.hrms.getEmployeeRoster = "CALL hrms.HRMSP_EMER_EMPLOYEE_ROSTER_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message"
config.hrms.getProductivityReportData = "CALL hrms.HRMSP_EMER_PRODUCTIVITY_REPORTS(?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
//Common SQL
config.common.GetMetaData = "CALL SYSSP_SEMD_METADATA_GET(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
//Roles SQL
//DB Configuration

config.rolesSQL.SaveRole = "CALL SYS_SERO_ROLE_SAVE(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.rolesSQL.AddRolePermissions = "CALL SYS_SERP_ROLEPERMISSIONS_ADD(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.rolesSQL.GetRolePermissions = "call SYS_SERP_ROLEPERMISSIONS_GET(?)";
config.rolesSQL.AddRoleUser = "CALL SYS_SERU_ROLEUSER_ADD(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.rolesSQL.GetRoleUsers = "call SYS_SERU_ROLEUSER_GET(?)";
config.rolesSQL.GetRole = 'call SYS_SERO_ROLE_GET(?)';
config.rolesSQL.GetRolesList = 'call SYS_SERO_ROLE_List()';
config.modulesSQL.GetModules = 'call SYS_SEMO_MODULE_SELECT()';
config.modulesSQL.getModulePermission = "CALL system.SYS_SEMO_MODULE_PERMISSION(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.modulesSQL.database = 'system';

config.usersSQL.GetUsersList = "CALL SYS_SEUS_USER_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.GetUserRoles = "call SYS_SERU_USERROLE_GET(?)";
config.usersSQL.GetUser = 'call SYS_SEUS_USER_GET(?)';
config.usersSQL.SaveUser = "CALL SYSSP_SEUS_USER_SAVE(?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.resetPassword = "CALL SYSSP_SEUS_USER_RESETPASSWORD(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.SearchUsersList = "CALL SYS_SEUS_USER_SEARCH(?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.DeleteUser = "CALL SYS_SEUS_USER_DELETE(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.usersSQL.searchUserName = "CALL SYS_SEUS_USER_NAME_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.auth.emailTemplate = "call SYSSP_SEET_EMAIL_TEMPLATE_GET (?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";

config.auth.login = "call SYS_SERU_USER_AUTH (?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.auth.saveLogin = "call SYS_SEBT_BREAK_TIME_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.auth.getLoginDtls = "call SYS_SEBT_BREAK_TIME_GET(?,@return_code,@return_message);";
config.auth.changePassword = "call SYS_SERU_USER_PWD_CHANGE (?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.auth.forgotPassword = "call SYS_SERU_VALIDATE_USER (?,@return_code,@return_message); select @return_code return_code,@return_message return_message";


config.auth.superSecret = '$2a$10$bE908V7zXrjqNFlJ4IG8me';
config.auth.passwordLength = "10";
config.auth.superKey

config.onBoard.savepersonalDetail = "CALL hrms.HRMSP_EMPH_EMPLOYEE_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveaddressDetail = "CALL hrms.HRMSP_EMAD_ADDRESS_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveEducationDetails = "CALL hrms.HRMSP_EMED_EDUCATION_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveEmploymentDetails = "CALL hrms.HRMSP_EMEH_EMPHISTORY_APPLY(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.searchEmployee = "CALL hrms.HRMSP_EMPH_EMPLOYEE_SEARCH(?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.employeeSearch = "CALL hrms.HRMSP_EMPH_EMPLOYEE_SEARCH(?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getPersonalDetails = "CALL hrms.HRMSP_EMPH_EMPLOYEE_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getAddressDetails = "CALL hrms.HRMSP_EMAD_ADDRESS_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getEducationDetails = "CALL hrms.HRMSP_EMED_EDUCATION_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getEmploymentDetails = "CALL hrms.HRMSP_EMEH_EMPHISTORY_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.currentRoleDetail = "INSERT INTO system.currentRoleDetail (`currentDesignation`,`department`,`shift`,`manager`,`salary`,`email`) VALUES (?,?,?,?,?,?)";
config.onBoard.saveAttachmentDetails = "CALL hrms.HRMSP_EMAT_ATTACHMENT_APPLY(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.getAttachmentDetails = "CALL hrms.HRMSP_EMAT_ATTACHMENT_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.deleteAttachment = "CALL hrms.HRMSP_EMAT_ATTACHMENT_DELETE(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.UploadPath = './uploads/';
//Leave Management
config.onBoard.saveLeaveDetails = "CALL hrms.HRMSP_EMLD_LEAVE_APPLY(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.searchLeave = "CALL hrms.HRMSP_EMLT_LEAVE_TRACK_SEARCH(?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.onBoard.saveLeaveStatusDetails = "CALL hrms.HRMSP_EMLT_LEAVE_TRACK_APPLY(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";

//Product Config
config.product.metaDataSQL = 'call SYS_SEMD_METADATA_SELECT()';
config.product.deleteMetaData = "CALL SYS_SEMD_METADATA_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.product.saveMetaDataDetails = 'CALL SYS_SEMD_METADATA_APPLY(?,?,?,?,?,?,?,?,?,@return_message); select @return_message return_message';
config.product.getAttachmentLocation = 'CALL product.PRD_PRAT_ATTACHMENT_GET(?,?,?,@return_code,@return_message); select @return_message return_message';

//Project Management - Opportunity 
config.opportunity.saveOpportunity = "CALL projectmanagment.PJMSP_PMOP_OPPORTUNITIES_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.opportunity.getOpportunityList = 'CALL projectmanagment.PJMSP_PMOP_OPPORTUNITIES_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.opportunity.getOpportunity = 'call projectmanagment.PJMSP_PMOP_OPPORTUNITIES_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';

// Project Management -OppoprunityWorklog     
config.opportunityWorklog.saveOpportunityWorklog = 'call projectmanagment.PJMSP_PMOL_OPP_WORKLOG_APPLY(?, ?, @RETURN_CODE, @RETURN_MESSAGE); select @return_code return_code,@return_message return_message';
config.opportunityWorklog.getOpportunityWorklog = 'call projectmanagment.PJMSP_PMOL_OPP_WORKLOG_GET(?, @RETURN_CODE, @RETURN_MESSAGE); select @return_code return_code,@return_message return_message';


module.exports = config;