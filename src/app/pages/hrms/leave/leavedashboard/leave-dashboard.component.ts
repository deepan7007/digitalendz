import { Component, OnInit, Output, Input, } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { environment } from '../../../../../environments/environment';
import { MetaData } from '../../../../common/models/metadata.model';
import { SmartableLinkcolumnComponent } from '../../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { Res } from '../../../../common/http/models/res.model';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'leavedashboard',
  templateUrl: './leave-dashboard.component.html',
  styleUrls: ['./leave-dashboard.component.scss']
})

export class LeaveDashboardComponent implements OnInit {

  emld_id: Number;
  status_code: String;
  leave = {
    EMLD_ID: 0,
    EMPH_ID: '',
    EMLD_TYPE: '',
    EMLD_APPLIED_DT: null,
    EMLD_FROM_DT: null,
    EMLD_TO_DT: null,
    EMLD_STATUS: '',
    EMPH_MANAGER_ID: '',
    ROOSTER_DT_RANGE: '',

  };
  settings = {
    actions: false,
    columns: {
      EMPH_ID: {
        title: 'Employee Id'
      },
      FULLNAME: {
        title: 'Employee Name',
        type: 'string'
      },
      EMLD_TYPE: {
        title: 'Leave Type',
        type: 'string'
      },
      EMLD_FROM_DT: {
        title: 'Leave From',
        type: 'string'
      },
      EMLD_TO_DT: {
        title: 'Leave To',
        type: 'string'
      },
      EMLD_APPLIED_DT: {
        title: 'Applied Date',
        type: 'string'
      },
      EMLD_REASONS: {
        title: 'Leave Details',
        type: 'string'
      },
      ACTION_APPROVE: {
        title: 'Approve',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: 'Approve',
            link: "/pages/hrms/leave/leavedashboard",
            linkparam: { emld_id: row.EMLD_ID, status_code: 'A' }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent
      },

      ACTION_REJECT: {
        title: 'Reject',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: 'Reject',
            link: "/pages/hrms/leave/leavedashboard",
            linkparam: { emld_id: row.EMLD_ID, status_code: 'R' }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent
      }
    }
  };
  tablesource: LocalDataSource = new LocalDataSource();

  getMetaData() {
    let promise = new Promise((resolve, reject) => {
      var filters = [{
        name: "module",
        value: "HRMS"
      },
      {
        name: "submodule",
        value: "LEAVE"
      },
      ];

      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getMetaData(metadata, 'HRMS', 'LEAVE', 'LEAVE_STATUS').then(
              (metadata: MetaData) => {
                this.leaveStatus = metadata;
              }
            );
            resolve();
          }
        );
    });
    return promise;
  }
  /** Leave Rooster Section */
  dateranges = ["This Week", "This Month", "Next Month", "Custom"];
  leaveStatus: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  leaveRoosterForm: FormGroup;
  leaveRooster = {
    EMLD_ID: 0,
    EMPH_ID: '',
    EMLD_TYPE: '',
    EMLD_APPLIED_DT: null,
    EMLD_FROM_DT: null,
    EMLD_TO_DT: null,
    EMLD_STATUS: '',
    EMPH_MANAGER_ID: '',
    ROOSTER_DT_RANGE: 'This Week'
  };
  leaveRoosterColumns = {
    actions: false,
    columns: {
      /*EMPH_FIRSTNAME: {
        title: 'First Name',
        type: 'string',
      },
      EMPH_LASTNAME: {
        title: 'First Name',
        type: 'string',
      },*/
      FULLNAME: {
        title: 'Employee Name',
        type: 'string'
      },
      EMLD_FROM_DT: {
        title: 'Leave From',
        type: 'string'
      },
      EMLD_TO_DT: {
        title: 'Leave To',
        type: 'string'
      },
      EMLD_STATUS: {
        title: 'Leave Status',

      }
    }
  };

  leaveRoosterTablesource: LocalDataSource = new LocalDataSource();

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,

  ) {

  }

  updateLeaveStatus(var_formdata) {
    this.service.postData(environment.saveLeaveStatusDetails, var_formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.refreshLeaveRequests();
          this.refreshLeaveRooster();
          this.commonfunctions.showToast(this.toasterService, "success", "Success", "Leave Status Updated successfully");
        }
      }
    );
  }

  queryLeaves(var_leaveFormData, roosterFlag) {
    this.service.postData(environment.searchLeave, var_leaveFormData).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          if (roosterFlag == true) {
            this.leaveRoosterTablesource.load(res.data);
          } else {
            this.tablesource.load(res.data);
          }
        }
      }
    );
  }

  refreshLeaveRequests() {

    var leaveRequestsFormData = {
      "leave": this.leave

    };
    this.queryLeaves(leaveRequestsFormData, false);
  }
  refreshLeaveRooster() {
    var leave = this.leave;
    var fromdate = this.leaveRoosterForm.get('roosterFromFormControl').value;
    var todate = this.leaveRoosterForm.get('roosterToFormControl').value;
    leave.ROOSTER_DT_RANGE = this.leaveRoosterForm.get('roosterDateRangeControl').value;
    leave.EMLD_FROM_DT = (new Date(fromdate).toLocaleDateString() == "Invalid Date") ? fromdate : new Date(fromdate).toLocaleDateString();
    leave.EMLD_TO_DT = (new Date(todate).toLocaleDateString() == "Invalid Date") ? todate : new Date(todate).toLocaleDateString();
    leave.EMLD_STATUS = this.leaveRoosterForm.get('leaveStatusControl').value;
    var roosterFormData = {
      "leave": leave
    };
    this.queryLeaves(roosterFormData, true);
  }




  loadLeaveDashboard() {
    var formdata;
    var updateFlag = false;
    formdata = {
      "emld_id": this.emld_id,
      "status_code": this.status_code
    };

    if (this.status_code != null) {
      if (this.status_code == 'A' || this.status_code == 'R') {
        this.updateLeaveStatus(formdata);
        updateFlag = true;
      }
    }
    if (!updateFlag) {
      this.refreshLeaveRequests();
      this.refreshLeaveRooster();
    }
  }

  ngOnInit() {

    this.leaveRoosterForm = new FormGroup({
      leaveStatusControl: new FormControl('ALL'),
      roosterDateRangeControl: new FormControl('This Week'),
      roosterFromFormControl: new FormControl('', Validators.required),
      roosterToFormControl: new FormControl('', Validators.required),
    });
    this.leaveRoosterForm.controls['roosterDateRangeControl'].valueChanges.subscribe((value) => {
      this.leaveRoosterTablesource.empty();
    });
    this.getMetaData().then(() => {

      this.route
        .queryParams
        .subscribe(params => {
          const message = params['message'];
          const leave_id = params['emld_id'];
          const status_code = params['status_code'];

          if ((!this.commonfunctions.isUndefined(leave_id) && leave_id != "") && (!this.commonfunctions.isUndefined(status_code) && status_code != "")) {
            this.emld_id = leave_id;
            this.status_code = status_code;
            this.loadLeaveDashboard();
          }
          else {
            this.loadLeaveDashboard();
          }

          if (!this.commonfunctions.isUndefined(message) && message != "") {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
          }
        });
    });
  }

}
