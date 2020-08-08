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
config.project = {};
config.expenses = {};
config.hyperloop = {};
config.projectAttachment = {};
config.invoice = {};

//DB Configuration
config.dbconcfig.host = 'digitalendz.c1ve42jt1fj6.us-west-1.rds.amazonaws.com';
config.dbconcfig.user = 'admin';
config.dbconcfig.password = 'digitalendz';
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
config.product.getMetadataFromTable = "CALL system.SYS_METADATA_GET(?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
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

//hyperloop
config.hyperloop.config = "select * from hyperloop.stock_offset_config";
config.hyperloop.configDemand = "select * from hyperloop.on_demand_stock_offset_config";
config.hyperloop.updateConfig = "update hyperloop.stock_offset_config set allowed_percentages = ? , buy_offset = ?, buy_limit = ? , buy_sl = ? , buy_tp = ? , order_type = ? , rev_offset = ? , sell_limit = ? , sell_offset = ? , sell_sl = ? , sell_tp = ? ,  trend_offset = ? , units = ? where id = ?";
config.hyperloop.updateConfigDemand = "update hyperloop.on_demand_stock_offset_config set allowed_percentages = ? , buy_offset = ?, buy_limit = ? , buy_sl = ? , buy_tp = ? , order_type = ? , rev_offset = ? , sell_limit = ? , sell_offset = ? , sell_sl = ? , sell_tp = ? ,  trend_offset = ? , units = ? where id = ?";
config.hyperloop.getAccountSettings = "SELECT * FROM hyperloop.oanda_accounts";
config.hyperloop.updateAccountSettings = "update hyperloop.oanda_accounts set account_id = ?, account_status =?, account_type =?,  account_rev_type =?, account_env =?, account_alias =?, account_mode =? where id = ?";
config.hyperloop.insertConfig = "INSERT INTO `hyperloop`.`stock_offset_config` ( `currency`, `order_type`, `units`, `buy_limit`, `buy_tp`, `buy_sl`, `sell_limit`, `buy_offset`, `sell_tp`, `sell_sl`, `active`, `allowed_percentages`, `eff_dt`, `sell_offset`,`rev_offset`,`trend_offset`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
config.hyperloop.insertConfigDemand = "INSERT INTO `hyperloop`.`on_demand_stock_offset_config` ( `currency`, `order_type`, `units`, `buy_limit`, `buy_tp`, `buy_sl`, `sell_limit`, `buy_offset`, `sell_tp`, `sell_sl`, `active`, `allowed_percentages`, `eff_dt`, `sell_offset`,`rev_offset`,`trend_offset`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
config.hyperloop.insertAccount = "INSERT INTO `hyperloop`.`oanda_accounts` (`account_id`,`account_url`,`account_domain`,`account_key`,`account_status`,`account_type`,`account_rev_type`,`account_env`,`account_alias`,`account_mode`) VALUES (?,?,?,?,?,?,?,?,?,?)";
//HyperLoop Config
config.hyperloop.getStockAccountsListHyper = "CALL hyperloop.HYPSP_STAC_STOCK_ACCOUNT_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.hyperloop.insertOrdersHyper = "INSERT INTO hyperloop.stk_stor_orders(STKM_CODE, STAC_ENV_TYPE, STAC_ACCOUNT_ID, STOR_ORDER_ID, STOR_CREATE_TIME, STOR_TYPE, STOR_UNITS, STOR_PRICE, STOR_TIME_IN_FORCE, STOR_TRIGGER_CONDITION, STOR_PARTIAL_FILL, STOR_POSITION_FILL, STOR_STATE, STOR_FILLING_TRANSACTION_ID, STOR_FILLING_TIME, STOR_TRADE_OPENED_ID, STOR_TP_PRICE, STOR_TP_TIME_IN_FORCE, STOR_SL_PRICE, STOR_SL_TIME_IN_FORCE,STOR_CANCELLED_TIME, STOR_CANCELLING_ID,STOR_CREATED_BY, STOR_CREATED_DTM) VALUES ? ON DUPLICATE KEY UPDATE STKM_CODE=values(STKM_CODE),STAC_ENV_TYPE=values(STAC_ENV_TYPE),STOR_CREATE_TIME=values(STOR_CREATE_TIME),STOR_TYPE=values(STOR_TYPE),STOR_UNITS=values(STOR_UNITS),STOR_PRICE=values(STOR_PRICE),STOR_TIME_IN_FORCE=values(STOR_TIME_IN_FORCE),STOR_TRIGGER_CONDITION=values(STOR_TRIGGER_CONDITION),STOR_PARTIAL_FILL=values(STOR_PARTIAL_FILL),STOR_POSITION_FILL=values(STOR_POSITION_FILL),STOR_STATE=values(STOR_STATE),STOR_FILLING_TRANSACTION_ID=values(STOR_FILLING_TRANSACTION_ID),STOR_FILLING_TIME=values(STOR_FILLING_TIME),STOR_TRADE_OPENED_ID=values(STOR_TRADE_OPENED_ID),STOR_TP_PRICE = values(STOR_TP_PRICE),STOR_TP_TIME_IN_FORCE = values(STOR_TP_TIME_IN_FORCE),STOR_SL_PRICE = values(STOR_SL_PRICE),STOR_CANCELLED_TIME = values(STOR_CANCELLED_TIME), STOR_CANCELLING_ID = values(STOR_CANCELLING_ID), STOR_SL_TIME_IN_FORCE = values(STOR_SL_TIME_IN_FORCE),STOR_MODIFIED_BY=?,STOR_MODIFIED_DTM=NOW();"
config.hyperloop.insertTradesHyper = "INSERT INTO hyperloop.stk_sttr_trades(STKM_CODE, STAC_ENV_TYPE, STAC_ACCOUNT_ID, STTR_TRADE_ID, STTR_PRICE, STTR_OPEN_TIME, STTR_INITIAL_UNITS, STTR_INITIAL_MARGIN_REQUIRED, STTR_STATE, STTR_CURRENT_UNITS, STTR_REALIZED_PL, STTR_FINANCING, STTR_DIVIDEND_ADJUSTMENT, STTR_UNREALIZED_PL, STTR_MARGIN_USED, STTR_CLOSING_IDS, STTR_CLOSE_TIME, STTR_AVG_CLOSE_PRICE, STTR_TP_ID, STTR_TP_CREATE_TIME, STTR_TP_TYPE, STTR_TP_TRADE_ID, STTR_TP_PRICE, STTR_TP_TIME_IN_FORCE, STTR_TP_TRIGGER_CONDITION, STTR_TP_STATE, STTR_TP_CANCELLING_ID, STTR_TP_CANCELLED_TIME, STTR_TP_FILLING_ID, STTR_TP_FILLING_TIME, STTR_TP_TRADES_CLOSED, STTR_SL_ID, STTR_SL_CREATE_TIME, STTR_SL_TYPE, STTR_SL_TRADE_ID, STTR_SL_PRICE, STTR_SL_TIME_IN_FORCE, STTR_SL_TRIGGER_CONDITION, STTR_SL_STATE, STTR_SL_CANCELLING_ID, STTR_SL_CANCELLING_TIME, STTR_SL_FILLING_ID, STTR_SL_FILLING_TIME, STTR_SL_TRADES_CLOSED, STTR_CREATED_BY, STTR_CREATED_DTM) VALUES ? ON DUPLICATE KEY UPDATE STKM_CODE = values(STKM_CODE), STTR_PRICE = values(STTR_PRICE), STTR_OPEN_TIME = values(STTR_OPEN_TIME), STTR_INITIAL_UNITS = values(STTR_INITIAL_UNITS), STTR_INITIAL_MARGIN_REQUIRED = values(STTR_INITIAL_MARGIN_REQUIRED), STTR_STATE = values(STTR_STATE), STTR_CURRENT_UNITS = values(STTR_CURRENT_UNITS), STTR_REALIZED_PL = values(STTR_REALIZED_PL), STTR_FINANCING = values(STTR_FINANCING), STTR_DIVIDEND_ADJUSTMENT = values(STTR_DIVIDEND_ADJUSTMENT), STTR_UNREALIZED_PL = values(STTR_UNREALIZED_PL), STTR_MARGIN_USED = values(STTR_MARGIN_USED), STTR_CLOSING_IDS = values(STTR_CLOSING_IDS), STTR_CLOSE_TIME = values(STTR_CLOSE_TIME), STTR_AVG_CLOSE_PRICE = values(STTR_AVG_CLOSE_PRICE), STTR_TP_ID = values(STTR_TP_ID), STTR_TP_CREATE_TIME = values(STTR_TP_CREATE_TIME), STTR_TP_TYPE = values(STTR_TP_TYPE), STTR_TP_TRADE_ID = values(STTR_TP_TRADE_ID), STTR_TP_PRICE = values(STTR_TP_PRICE), STTR_TP_TIME_IN_FORCE = values(STTR_TP_TIME_IN_FORCE), STTR_TP_TRIGGER_CONDITION = values(STTR_TP_TRIGGER_CONDITION), STTR_TP_STATE = values(STTR_TP_STATE), STTR_TP_CANCELLING_ID = values(STTR_TP_CANCELLING_ID), STTR_TP_CANCELLED_TIME = values(STTR_TP_CANCELLED_TIME), STTR_TP_FILLING_ID = values(STTR_TP_FILLING_ID), STTR_TP_FILLING_TIME = values(STTR_TP_FILLING_TIME), STTR_TP_TRADES_CLOSED = values(STTR_TP_TRADES_CLOSED), STTR_SL_ID = values(STTR_SL_ID), STTR_SL_CREATE_TIME = values(STTR_SL_CREATE_TIME), STTR_SL_TYPE = values(STTR_SL_TYPE), STTR_SL_TRADE_ID = values(STTR_SL_TRADE_ID), STTR_SL_PRICE = values(STTR_SL_PRICE), STTR_SL_TIME_IN_FORCE = values(STTR_SL_TIME_IN_FORCE), STTR_SL_TRIGGER_CONDITION = values(STTR_SL_TRIGGER_CONDITION), STTR_SL_STATE = values(STTR_SL_STATE), STTR_SL_CANCELLING_ID = values(STTR_SL_CANCELLING_ID), STTR_SL_CANCELLING_TIME = values(STTR_SL_CANCELLING_TIME), STTR_SL_FILLING_ID = values(STTR_SL_FILLING_ID), STTR_SL_FILLING_TIME = values(STTR_SL_FILLING_TIME), STTR_SL_TRADES_CLOSED = values(STTR_SL_TRADES_CLOSED), STTR_MODIFIED_BY = ?, STTR_MODIFIED_DTM = NOW(); "
config.hyperloop.getHyperorderData = "CALL hyperloop.HYPSP_STOH_ORDER_SEARCH(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.hyperloop.getHyperorderDataSummary = "CALL hyperloop.HYPSP_STOH_ORDER_SUMMARY_SEARCH(?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";

//Product Config
config.product.metaDataSQL = 'call SYS_SEMD_METADATA_SELECT()';
config.product.deleteMetaData = "CALL SYS_SEMD_METADATA_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.product.saveMetaDataDetails = 'CALL SYS_SEMD_METADATA_APPLY(?,?,?,?,?,?,?,?,?,@return_message); select @return_message return_message';
config.product.getAttachmentLocation = 'CALL product.PRD_PRAT_ATTACHMENT_GET(?,?,?,@return_code,@return_message); select @return_message return_message';

//Project Management - Opportunity 
config.opportunity.saveOpportunity = "CALL projectmanagment.PJMSP_PMOP_OPPORTUNITIES_APPLY(?,?,?,?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.opportunity.getOpportunityList = 'CALL projectmanagment.PJMSP_PMOP_OPPORTUNITIES_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.opportunity.getOpportunity = 'call projectmanagment.PJMSP_PMOP_OPPORTUNITIES_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';

// Project Management -OppoprunityWorklog     
config.opportunityWorklog.saveOpportunityWorklog = 'call projectmanagment.PJMSP_PMOL_OPP_WORKLOG_APPLY(?, ?, @RETURN_CODE, @RETURN_MESSAGE); select @return_code return_code,@return_message return_message';
config.opportunityWorklog.getOpportunityWorklog = 'call projectmanagment.PJMSP_PMOL_OPP_WORKLOG_GET(?, @RETURN_CODE, @RETURN_MESSAGE); select @return_code return_code,@return_message return_message';

//Project Management - Project 
config.project.saveProject = "CALL projectmanagment.PJMSP_PMPRJ_PROJECTS_APPLY(?,?,?,?,?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.project.getProjectList = 'CALL projectmanagment.PJMSP_PMPRJ_PROJECTS_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.project.getProject = 'call projectmanagment.PJMSP_PMPRJ_PROJECTS_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.project.searchProject = 'call projectmanagment.PJMSP_PMPRJ_PROJECTS_SEARCH(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';


//Project Management - Expenses 
config.expenses.saveExpense = "CALL projectmanagment.PJMSP_PMEXP_EXPENSES_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.expenses.getExpenseList = 'CALL projectmanagment.PJMSP_PMEXP_EXPENSES_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.expenses.getExpense = 'call projectmanagment.PJMSP_PMEXP_EXPENSES_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.expenses.searchExpense = 'call projectmanagment.PJMSP_PMEXP_EXPENSES_SEARCH(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.expenses.deleteExpense = 'call projectmanagment.PJMSP_PMEXP_EXPENSES_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';

//ProjectAttachment
config.projectAttachment.saveProjectAttachment='CALL projectmanagment.PJMSP_PMAT_ATTACHMENT_APPLY(?,?,?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.projectAttachment.getProjectAttachment='CALL projectmanagment.PJMSP_PMAT_ATTACHMENT_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.projectAttachment.deleteProjectAttachment='CALL projectmanagment.PJMSP_PMAT_ATTACHMENT_DELETE(?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.projectAttachment.UploadPath = './uploads/project/';

//Project Management - Invoice 
config.invoice.saveInvoice = "CALL projectmanagment.PJMSP_PMINV_INVOICE_APPLY(?,?,?,?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message";
config.invoice.getInvoiceList = 'CALL projectmanagment.PJMSP_PMINV_INVOICE_LIST(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.invoice.getInvoice = 'call projectmanagment.PJMSP_PMINV_INVOICE_GET(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.invoice.searchInvoice = 'call projectmanagment.PJMSP_PMINV_INVOICE_SEARCH(?,?,@return_code,@return_message); select @return_code return_code,@return_message return_message';
config.invoice.deleteInvoice = 'call projectmanagment.PJMSP_PMINV_INVOICE_DELETE(?,@return_code,@return_message); select @return_code return_code,@return_message return_message';

module.exports = config;