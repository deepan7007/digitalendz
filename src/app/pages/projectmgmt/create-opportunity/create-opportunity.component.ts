import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'create-opportunity',
  templateUrl: './create-opportunity.component.html',
  styleUrls: ['./create-opportunity.component.scss']
})
export class CreateOpportunityComponent implements OnInit {

  formGroup: FormGroup;
  projectFormGroup: FormGroup;
  source: LocalDataSource = new LocalDataSource();
  extectedStartDate: string;
  extectedEndDate: string;
  PMOP_STATUS_LIST: any = ['Initial', 'Discussion', 'Negotiation', 'Won', 'Lost', 'Cancled'];
  PMOP_REVENUE_LIST: any = ['USD', 'INR', 'CD'];
  PMOP_STATUS: any;
  PMOP_REVENUE_TYPE: any;
  placement = 'bottom';
  showId: boolean = false;
  canCreateProject: boolean = false;
  datePipe = new DatePipe('en-US');


  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,
  ) { }


  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      PMOP_ID: ['',],
      PMOP_NAME: ['', Validators.required],
      PMOP_EXPECTED_START_DATE: ['',],
      PMOP_EXPECTED_END_DATE: ['',],
      PMOP_REVENUE: ['',],
      PMOP_REVENUE_TYPE: ['',],
      PMOP_OWNER: ['',],
      PMOP_STATUS: ['', Validators.required],
      PMOP_CUSTOMER_NAME: ['',],
      PMOP_CUSTOMER_PHONE: ['',],
      PMOP_PROSPECT_FOR_NEXT: ['',],
      PMOP_REFERRAL_OUTSIDE_SOURCE: ['',],
      PMOP_COMMENTS: ['',],
    });

    this.route
      .queryParams
      .subscribe(params => {
        const opportunityId = params['opportunityId'];

        if (!this.commonfunctions.isUndefined(opportunityId) && opportunityId != "") {
          this.showId = true;
          this.formGroup.value.PMOP_ID = opportunityId;
          this.service.postData(environment.searchOpportunity, this.formGroup.value).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                res.data[0].PMOP_EXPECTED_START_DATE = this.parseDate(res.data[0].PMOP_EXPECTED_START_DATE);
                res.data[0].PMOP_EXPECTED_END_DATE = this.parseDate(res.data[0].PMOP_EXPECTED_END_DATE);
                this.formGroup.get('PMOP_ID').disable();
                if (res.data[0].PMOP_STATUS == 'Won') {
                  this.canCreateProject = true;
                }

                this.formGroup.patchValue(res.data[0]);
              }
            }
          );
        }
      })
  }

  onSubmit() {
    if (!this.formGroup.invalid) {
      if (!this.showId) {
        this.formGroup.value.PMOP_ID = null;
      }
      this.formGroup.value.PMOP_EXPECTED_START_DATE = this.formGroup.value.PMOP_EXPECTED_START_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.day;
      this.formGroup.value.PMOP_EXPECTED_END_DATE = this.formGroup.value.PMOP_EXPECTED_END_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.day;
      this.formGroup.get('PMOP_ID').enable();
      this.service.postData(environment.saveOpportunity, this.formGroup.value).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.source.load(res.data);
            this.commonfunctions.showToast(this.toasterService, 'Saved succesfully', "Error", res.return_message);
            this.formGroup.get('PMOP_ID').disable();
          }
        }
      );
      alert('submited');
    }
  }

  parseDate(value: string): NgbDateStruct {
    let returnVal: NgbDateStruct;
    let date = moment(value).format("YYYY-MM-DD");
    if (!date) {
      returnVal = null;
    } else {
      try {
        let dateParts = this.datePipe.transform(date, 'M-d-y').split('-');
        returnVal = { year: parseInt(dateParts[2]), month: parseInt(dateParts[0]), day: parseInt(dateParts[1]) };
      } catch (e) {
        returnVal = null;
      }
    }
    return returnVal;
  }

  onCreateProject() {

    this.formGroup.get('PMOP_ID').enable();
    this.projectFormGroup = this.formBuilder.group({
      PMPRJ_ID: [null,],
      PMOP_ID: [this.formGroup.value.PMOP_ID,],
      PMPRJ_NAME: [this.formGroup.value.PMOP_NAME,],
      PMPRJ_PM: [null,],
      PMPRJ_REVENUE: [this.formGroup.value.PMOP_REVENUE,],
      PMPRJ_COST_SPENT: [null,],
      PMPRJ_CP_PERCENTAGE: [null,],
      PMPRJ_START_DATE: [this.formGroup.value.PMOP_EXPECTED_START_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.day,],
      PMPRJ_END_DATE: [this.formGroup.value.PMOP_EXPECTED_END_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.day,],
    });
    this.formGroup.get('PMOP_ID').disable();

    this.service.postData(environment.saveProject, this.projectFormGroup.value).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.commonfunctions.showToast(this.toasterService, 'Saved succesfully', "Error", res.return_message);
        }
      }
    );

  }

}
