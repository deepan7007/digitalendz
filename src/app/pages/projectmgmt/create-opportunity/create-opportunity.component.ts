import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { NbToastrService } from '@nebular/theme';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'create-opportunity',
  templateUrl: './create-opportunity.component.html',
  styleUrls: ['./create-opportunity.component.scss']
})
export class CreateOpportunityComponent implements OnInit {

  formName: string = 'Create Opportunity';
  formGroup: FormGroup;
  projectFormGroup: FormGroup;
  private destroy$ = new Subject();
  loading: boolean;
  extectedStartDate: string;
  extectedEndDate: string;
  PMOP_STATUS_LIST: any = ['Initial', 'Discussion', 'Negotiation', 'Won', 'Lost', 'Cancled'];
  PMOP_REVENUE_LIST: any = ['USD', 'INR'];
  PMOP_COMANY_LIST: any = ['SRK Digitech LLC', 'Neural Schema Infotech'];
  YES_NO: any = ['Yes', 'No'];
  REFERAL_TYPE: any = ['Internal', 'External'];
  PMOP_STATUS: any;
  PMOP_REVENUE_TYPE: any;
  placement = 'bottom';
  showId: boolean = false;
  canCreateProject: boolean = false;
  datePipe = new DatePipe('en-US');
  message: string = '';
  isProjectCreated: boolean = false;
  PMOP_ID: string;
  buttonEl: string;
  isReferral: boolean = false;
  isReferralInternal: boolean = false;
  selectedStatus = 'Initial';


  managers = [];
  manager = "";
  managerName = "";

  owners = [];
  owner = "";
  ownerName = "";

  referrals = [];
  referral = "";
  referralName = "";


  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,
    private router: Router,
  ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      PMOP_ID: ['',],
      PMOP_NAME: ['', Validators.required],
      PMOP_COMPANY: ['',],
      PMOP_EXPECTED_START_DATE: ['',],
      PMOP_EXPECTED_END_DATE: ['',],
      PMOP_REVENUE: ['',],
      PMOP_REVENUE_TYPE: ['',],
      PMOP_OWNER: ['',],
      PMOP_STATUS: [this.selectedStatus, Validators.required],
      PMOP_CUSTOMER_NAME: ['',],
      PMOP_CUSTOMER_PHONE: ['',],
      PMOP_PROSPECT_FOR_NEXT: ['',],
      PMOP_REFERRAL: ['',],
      PMOP_REFERRAL_TYPE: ['',],
      PMOP_REFERRAL_ID: ['',],
      REFERRAL_EMP_NAME: ['',],
      PMOP_REFERRAL_ID1: ['',],
      REFERRAL_EMP_NAME1: ['',],
      PMOP_REFERRAL_NAME: ['',],
      PMOP_COMMENTS: ['',],
      PMPRJ_PM: ['',],
      PMPRJ_PMNAME: ['',],
      PMOP_OWNER_ID: ['',],
      PMPRJ_PM_ID: ['',],
      PMPRJ_PM_NAME: ['',],
      PM_NAME: ['',],
      OWNER_NAME: ['',],
    });
    this.formGroup.get('PM_NAME').disable();
    this.formGroup.get('OWNER_NAME').disable();
    this.formGroup.get('REFERRAL_EMP_NAME').disable();

    this.route.queryParams.subscribe(params => {
      const opportunityId = params['opportunityId'];
      if (!this.commonfunctions.isUndefined(opportunityId) && opportunityId != "") {
        this.showId = true;
        this.formName = 'Edit Opportunity';
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
            
              this.formGroup.patchValue(res.data[0]);
              this.setReferrals(res.data[0]);

              if (res.data[0].PMOP_STATUS == 'Won') {
                this.onSearchProject();
              }
            }
          });
      }
    });
  }

  onSubmit() {
    if (!this.formGroup.invalid) {
      this.loading = true;
      this.formGroup.get('PMOP_ID').enable();
      if (!this.showId) {
        this.formGroup.value.PMOP_ID = null;
      }
      this.formGroup.value.PMOP_EXPECTED_START_DATE = this.formGroup.value.PMOP_EXPECTED_START_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.day;
      this.formGroup.value.PMOP_EXPECTED_END_DATE = this.formGroup.value.PMOP_EXPECTED_END_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.day;

      let promise = new Promise((resolve, reject) => {
        this.service.postData(environment.saveOpportunity, this.formGroup.value)
          .takeUntil(this.destroy$)
          .subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                this.commonfunctions.showToast(this.toasterService, "success", "Opportunity Created Successfully", res.return_message);
                this.formGroup.get('PMOP_ID').disable();
                this.router.navigate(['/pages/projectmgmt/opportunity'], { queryParams: { message: res.return_message } });
              }
            });
        resolve();
      });
      return promise;
    }
  }

  onCreateProject() {
    this.formGroup.enable();
    this.formGroup.get('PMOP_ID').enable();
    this.projectFormGroup = this.formBuilder.group({
      PMPRJ_ID: [null,],
      PMOP_ID: [this.formGroup.value.PMOP_ID,],
      PMPRJ_NAME: [this.formGroup.value.PMOP_NAME,],
      PMPRJ_PM_ID: [this.formGroup.value.PMPRJ_PM_ID,],
      PMPRJ_REVENUE: [this.formGroup.value.PMOP_REVENUE,],
      PMPRJ_CURRENCY: [this.formGroup.value.PMOP_REVENUE_TYPE,],
      PMPRJ_COST_SPENT: [null,],
      PMPRJ_CP_PERCENTAGE: [null,],
      PMPRJ_START_DATE: [this.formGroup.value.PMOP_EXPECTED_START_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_START_DATE.day,],
      PMPRJ_END_DATE: [this.formGroup.value.PMOP_EXPECTED_END_DATE.year + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.month + '/' + this.formGroup.value.PMOP_EXPECTED_END_DATE.day,],
    });
    this.formGroup.get('PMOP_ID').disable();
    this.formGroup.disable();

    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.saveProject, this.projectFormGroup.value)
        .takeUntil(this.destroy$)
        .subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              this.commonfunctions.showToast(this.toasterService, "success", "Project Created Successfully", res.return_message);
              this.router.navigate(['/pages/projectmgmt/ProjectDetails'], { queryParams: { message: res.return_message } });
            }
          });
      resolve();
    });
    return promise;
  }

  onSearchProject() {
    this.formGroup.get('PMOP_ID').enable();
    this.projectFormGroup = this.formBuilder.group({
      PMOP_ID: [this.formGroup.value.PMOP_ID,],
    });

    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.searchProjectByOpportunity, this.projectFormGroup.value)
        .takeUntil(this.destroy$)
        .subscribe(
          (project: Res) => {
            if (project.return_code == 0) {
              this.isProjectCreated = true;
              if (this.commonfunctions.isUndefined(project.data[0])) {
                this.canCreateProject = true;
              }
            }
            else {
              this.message = project.return_message;
            }
          },
          (err) => {
            console.log('Something went wrong! ' + err.error);
          });
      resolve();
      this.formGroup.get('PMOP_ID').disable();
      this.formGroup.disable();
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

  onOwnerUserChange() {
    let promise = new Promise((resolve, reject) => {
      if (this.owner != null) {
        if (this.owner.length >= 3) {
          var formData = {
            username: this.owner
          };
          this.service.postData(environment.searchUserName, formData).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                var string = JSON.stringify(res.data);
                var data = JSON.parse(string);
                this.owners = data;
              }
            });
        }
      }
      resolve();
    });
    return promise;
  }


  onReferralUserChange() {
    let promise = new Promise((resolve, reject) => {
      if (this.referral != null) {
        if (this.referral.length >= 3) {
          var formData = {
            username: this.referral
          };
          this.service.postData(environment.searchUserName, formData).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                var string = JSON.stringify(res.data);
                var data = JSON.parse(string);
                this.referrals = data;
              }
            });
        }
      }
      resolve();
    });
    return promise;
  }

  onManagerChange(managerid) {
    this.managers.forEach((user) => {
      if (user.ID == managerid) {
        this.managerName = user.USERNAME
      }
    });
  }

  onOwnerChange(ownerid) {
    this.owners.forEach((user) => {
      if (user.ID == ownerid) {
        this.ownerName = user.USERNAME
      }
    });
  }

  onReferralIDChange(referralId) {
    // console.log('Referral change');
    this.referrals.forEach((user) => {
      if (user.ID == referralId) {
        this.referralName = user.USERNAME;
        this.formGroup.get('REFERRAL_EMP_NAME').patchValue(user.USERNAME);
      }
    });
  }

  setReferrals(opportunity) {
    if (opportunity.PMOP_REFERRAL.includes(this.YES_NO[0])) {
      this.isReferral = true;
      if (opportunity.PMOP_REFERRAL_TYPE.includes(this.REFERAL_TYPE[0])) {
        this.isReferralInternal = true;
      }
    }
   
  }

  onCompanyChange(event) {
    if (event.target.value.includes(this.PMOP_COMANY_LIST[0])) {
      this.formGroup.get('PMOP_REVENUE_TYPE').patchValue('INR');
    }
    else if (event.target.value.includes(this.PMOP_COMANY_LIST[1])) {
      this.formGroup.get('PMOP_REVENUE_TYPE').patchValue('USD');
    }
  }

  onReferralChange(event) {
    if (event.target.value.includes(this.YES_NO[0])) {
      this.isReferral = true;
    }
  }

  onReferralTypeChange(event) {
    if (event.target.value.includes(this.REFERAL_TYPE[0])) {
      this.isReferralInternal = true;
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

}
