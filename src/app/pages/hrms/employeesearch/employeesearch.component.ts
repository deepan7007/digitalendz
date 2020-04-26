import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Res } from '../../../common/http/models/res.model';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { environment } from '../../../../environments/environment';
import { NbThemeService, NbToastrService, NbDialogRef } from '../../../../../node_modules/@nebular/theme';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';
import { ChartSelectEvent } from 'ng2-google-charts';
import * as decode from 'jwt-decode';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'employeesearch',
  templateUrl: './employeesearch.component.html',
  styleUrls: ['./employeesearch.component.scss']
})
export class EmployeesearchComponent implements OnInit {

  d = new Date();
  startDate = {
    year: this.d.getFullYear(),
    month: this.d.getMonth(),
    day: this.d.getDay(),
  };
  endDate = {
    year: this.d.getFullYear(),
    month: this.d.getMonth(),
    day: this.d.getDay(),
  };
  agents = [];
  agent = "ALL";
  company = "ALL";
  dept = "";
  designation = "";
  role = "";
  manager = ""
  managerName = "";
  resourceName = "";
  companies = [];
  depts = [];
  designations = [];
  roles = [];

  chartviews: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  dateranges: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  timezones: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  timezone = "";
  token_Payload = decode(localStorage.getItem('auth_app_token'));
  //user = this.token_Payload.email;
  user = "";
  users = [];
  managers = [];

  selectedsource: LocalDataSource = new LocalDataSource();
  onCancel(): void {
    
    this.activeModal.close();

  }
  onAdd(): void {
    this.activeModal.close(this.selectedsource);

  }
  rowClicked(event): void {
    this.selectedsource.empty();
    this.selectedsource.add(event.selected);
  }
  settings = {
    selectMode: 'multi',
    actions: false,
    pager: {
      //display: false,
      perPage: 30,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    attr: {
      // class: 'table table-bordered'
    },
    //hideSubHeader :true,
    columns: {
      EMPH_ID: {
        title: 'Employee ID',
        type: 'String',
      },
      EMPH_FIRSTNAME: {
        title: 'First Name',
        type: 'string',
      },
      EMPH_LASTNAME: {
        title: 'Last Name',
        type: 'string',
      },
      EMPH_DEPT: {
        title: 'Department',
        type: 'string',
      },
      EMPH_DESIGNATION: {
        title: 'Designation',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private router: Router,
    private activeModal: NbDialogRef<any>,
    private theme: NbThemeService,
  ) {
    this.getMetaData().then(() => {
      this.onSearch();
    });;

  }
  ngOnInit() {

  }
  onUserChange() {
    if (this.user.length >= 3) {
      var formData = {
        username: this.user
      };
      this.service.postData(environment.searchUserName, formData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            var string = JSON.stringify(res.data);
            var data = JSON.parse(string);
            this.users = data;

          }
        });
    }
  }
  onCompanyChange() {
    let promise = new Promise((resolve, reject) => {
      var formdata = {
        company_id: this.company,
      }
      this.service.postData(environment.getDepartment, formdata)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.depts = metadata;

          });
      resolve();
    });
    return promise;
  }
  onDeptChange() {
    let promise = new Promise((resolve, reject) => {
      var formdata = {
        company_id: this.company,
        dept_id: this.dept,
      }
      this.service.postData(environment.getDesignation, formdata)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.designations = metadata;

          });
      resolve();
    });
    return promise;
  }
  onDesignationChange() {
    let promise = new Promise((resolve, reject) => {
      var formdata = {
        company_id: this.company,
        designation_id: this.designation,
      }
      this.service.postData(environment.getEmployeeRoles, formdata)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.roles = metadata;

          });
      resolve();
    });
    return promise;
  }
  onManagerUserChange() {
    let promise = new Promise((resolve, reject) => {
      if (this.manager != null) {

        if (this.manager.length >= 3) {
          var formData = {
            username: this.manager
          };
          this.service.postData(environment.searchUserName, formData).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                var string = JSON.stringify(res.data);
                var data = JSON.parse(string);
                this.managers = data;

              }
            });
        }
      }
      resolve();
    });
    return promise;
  }
  onUserIDChange(userid) {
    this.users.forEach((user) => {
      if (user.ID == userid) {
        this.resourceName = user.USERNAME
      }
    });

  }
  onManagerChange(managerid) {
    this.managers.forEach((user) => {
      if (user.ID == managerid) {
        this.managerName = user.USERNAME
      }
    });

  }
  onSearch() {
    var FormData = {
      EMPH_ID: this.user,
      EMPH_FIRSTNAME: this.resourceName,
      PRCM_ID: this.company,
      EMPH_DEPT: this.dept,
      EMPH_DESIGNATION: this.designation,
      EMPH_MANAGER_ID: this.manager,
      EMPH_ROLE: this.role,
      EMPH_MANAGER_NAME: this.managerName
    };
    this.service.postData(environment.employeeSearch, FormData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          if (res.data.length == 0) {
            this.source.load(res.data);
            this.commonfunctions.showToast(this.toasterService, "warning", "Warning", "No Data Found");
            return;
          }
          this.source.load(res.data);

        }
      });
  }


  getMetaData() {
    let promise = new Promise((resolve, reject) => {
      var filters: Filter[] = [{
        name: "module",
        value: "REPORT"
      },
      {
        name: "submodule",
        value: "REPORT"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getMetaData(metadata, 'REPORT', 'REPORT', 'REPORT_PERIOD').then(
              (metadata: MetaData) => {
                this.dateranges = metadata;
              });
            this.commonfunctions.getMetaData(metadata, 'REPORT', 'REPORT', 'CHART_VIEW').then(
              (metadata: MetaData) => {
                this.chartviews = metadata;
              });
            this.commonfunctions.getMetaData(metadata, 'REPORT', 'REPORT', 'TIMEZONE').then(
              (metadata: MetaData) => {
                this.timezones = metadata;
              });
            this.service.postData(environment.getMetadataFromTable, { dbname: "integration", tablename: "int_inum_user_mapping", columnname: "SALESPERSON_ID" })
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.agents = metadata;
                });
            var formdata = {
              path: this.router.url.split('?')[0],
              all_flag: "Y"
            }
            this.service.postData(environment.getCompanies, formdata)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.companies = metadata;

                });

            resolve();
          });


    });
    return promise;
  }

  public onClick(event: ChartSelectEvent) {
  }

}

