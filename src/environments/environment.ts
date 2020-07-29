/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  resetPassword:"api/resetPassword",
  getUsers:"api/getUsers",
  deleteUser:"api/deleteUser",
  saveUser:"api/saveUser",
  getUser:"api/getUser",
  getModulePermission:"api/getModulePermission",
  getCompanies:"api/getCompanies",
  saveRole:"api/saveRole",
  getRole:"api/getRole",
  getRoles:"api/getRoles",
  getModules:"api/getModules",
  getMetaData:"api/getMetaData",
  saveLeaveDetails:"api/saveLeaveDetails",
  saveLeaveStatusDetails:"api/saveLeaveStatusDetails",
  searchLeave:"api/searchLeave",
  getMetadataFromTable:"api/getMetadataFromTable",
  getDepartment:"api/getDepartment",
  getDesignation:"api/getDesignation",
  getEmployeeRoles:"api/getEmployeeRoles",
  searchUserName:"api/searchUserName",
  getPersonalDetails:"api/getPersonalDetails",
  saveEmpPersonalDetails:"api/saveEmpPersonalDetails",
  searchEmployee:"api/searchEmployee",
  saveAttachmentDetails:"api/saveAttachmentDetails",
  getAttachmentDetails:"api/getAttachmentDetails",
  deleteAttachment:"api/deleteAttachment",
  searchUsers:"api/searchUsers",
  saveEmploymentDetails:"api/saveEmploymentDetails",
  getEmploymentDetails:"api/getEmploymentDetails",
  getEducationDetails:"api/getEducationDetails",
  saveEducationDetails:"api/saveEducationDetails",
  employeeSearch:"api/employeeSearch",
  getAddressDetails:"api/getAddressDetails",
  saveAddressDetails:"api/saveAddressDetails",
  getAttachmentContent:"api/getAttachmentContent",
  saveOpportunity:"api/saveOpportunity",
  getOpportunities:"api/getOpportunities",
  searchOpportunity: "/api/searchOpportunity",
  saveOpportunityWorklog:"api/saveOpportunityWorklog",
  searchOpportunityWorklog:"api/searchOpportunityWorklog",
  saveProject:"api/saveProject",
  getProjects:"api/getProjects",
  searchProject: "/api/searchProject",
  searchProjectByOpportunity: "/api/searchProjectByOpportunity",
  saveExpenses:"/api/saveExpenses",
  getExpenses:"/api/getExpenses",
  searchExpense:"/api/searchExpense",
  deleteExpemse:"/api/deleteExpense",
  searchExpensesByProject:"/api/searchExpensesByProject",
  saveProjectAttachmentDetails:"saveProjectAttachmentDetails",
  getProjectAttachmentDetails:"/api/getProjectAttachmentDetails",
  deleteProjectAttachment:"/api/deleteProjectAttachment",

  format: {
    email: /^[a-z]+[a-z0-9._]+@[a-z]+\.[a-z.]{2,5}$/,
    noSpace: /^\S*$/,
    //date: //
  }
};
