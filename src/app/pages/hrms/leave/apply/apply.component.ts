import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, FormGroupDirective, Validators, NgForm } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { environment } from '../../../../../environments/environment';
import { MetaData } from '../../../../common/models/metadata.model';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { NbToastrService } from '@nebular/theme';
import { Res } from '../../../../common/http/models/res.model';


@Component({
  selector: 'apply',
  templateUrl: './apply.component.html',
  styleUrls: ['./apply.component.scss']
})
export class ApplyComponent implements OnInit {
  //selectedLeaveType: string = "Personal Leave";
  applyLeaveform: FormGroup;
  leavetype: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  leaveAppliedDate = null;
  emld_id = null;

  settings = {
    actions: false,
    apply: {

    },
    columns: {
      LEAVE_TYPE: {
        title: 'Leave Type',
        type: 'string',
        filter: false,
      },
      LEAVE_DURATION_FROM: {
        title: 'Leave Duration From',
        type: 'string',
      },
      LEAVE_DURATION_TO: {
        title: 'Leave Duration To',
        type: 'string',
      },
      LEAVE_REASON: {
        title: 'Leave Reason',
        type: 'string',
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,

  ) {
    //this.onApplyLeave();
  }

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
            this.commonfunctions.getMetaData(metadata, 'HRMS', 'LEAVE', 'LEAVE_TYPE').then(
              (metadata: MetaData) => {
                this.leavetype = metadata;
              }
            );
            resolve();
          }
        );
    });
    return promise;
  }

  calculateDays() {

    var endDt = new Date(this.applyLeaveform.get('leaveToFormControl').value);
    var fromDt = new Date(this.applyLeaveform.get('leaveFromFormControl').value);
    var timediff = Math.abs(endDt.getTime() - fromDt.getTime());
    this.applyLeaveform.patchValue({
      leaveNumDaysControl: (Math.abs(timediff / (1000 * 3600 * 24)) + 1).toString()
    });

  }

  onSubmit(f) {
    if (f.invalid) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before submitting");
    }
    else {
      var formdata = {
        leavetype: this.applyLeaveform.get('leaveTypeControl').value,
        leaveStartDate: this.applyLeaveform.get('leaveFromFormControl').value,
        leaveEndDate: this.applyLeaveform.get('leaveToFormControl').value,
        numOfDays: this.applyLeaveform.get('leaveNumDaysControl').value,
        leaveReason: this.applyLeaveform.get('leaveReasonControl').value,
        emldID: this.emld_id,
      }
      this.service.postData(environment.saveLeaveDetails, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", res.return_message);
          }
        }
      );
    }
  }

  ngOnInit() {

    this.applyLeaveform = new FormGroup({

      leaveTypeControl: new FormControl({value:'PERSONAL'}),
      leaveFromFormControl: new FormControl('', Validators.required),
      leaveToFormControl: new FormControl('', Validators.required),
      leaveNumDaysControl: new FormControl({value: 0, disabled: true}, Validators.required),
      leaveReasonControl: new FormControl(),

    });
    this.applyLeaveform.controls['leaveToFormControl'].valueChanges.subscribe((value) => {
      this.calculateDays();
    });
    this.getMetaData().then(() => {
      this.route.queryParams
        .subscribe(params => {
          const message = params['message'];
          if (!this.commonfunctions.isUndefined(message) && message != "") {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
          }
        });
    });
  }

}
