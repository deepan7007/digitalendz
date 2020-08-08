import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { NbToastrService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { NgbDateStruct, NgbDate, NgbCalendar, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss']
})
export class CreateProjectComponent implements OnInit {

  formName : string ='Create New Project';
  formGroup: FormGroup;
  placement = 'bottom';
  showId: boolean = false;
  isDisabled: boolean = false;
  datePipe = new DatePipe('en-US');
  private destroy$ = new Subject();
  loading: boolean;
  buttonEl: string;
  PMPRJ_STATUS_LIST: any = ['Active', 'DiscCompletedussion', 'Onhold', 'Terminated'];
  //put in the project component which is to be created
  projectSource: LocalDataSource = new LocalDataSource();
  message: string = '';
  PMPRJ_ID: string ='';

  managers = [];
  manager = "";
  managerName = "";

  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,
    private router: Router,
    ) { }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      PMPRJ_ID: ['',],
      PMOP_ID: ['',],
      PMPRJ_NAME: ['', Validators.required],
      PMPRJ_STATUS: ['', Validators.required],
      PMPRJ_PM_ID: ['',],
      PM_NAME: ['',],
      PMPRJ_REVENUE: ['',],
      PMPRJ_COST_SPENT: ['',],
      PMPRJ_CP_PERCENTAGE: ['',],
      PMPRJ_START_DATE: ['',],
      PMPRJ_END_DATE: ['', Validators.required],
    });
    this.formGroup.get('PMPRJ_COST_SPENT').disable();
    this.formGroup.get('PMPRJ_CP_PERCENTAGE').disable();
    this.formGroup.get('PM_NAME').disable();

    this.route
      .queryParams
      .subscribe(params => {
        const ProjectId = params['projectId'];
        this.PMPRJ_ID=  params['projectId'];

        if (!this.commonfunctions.isUndefined(ProjectId) && ProjectId != "") {
          this.showId = true;
          this.formName='Edit Project';
          this.formGroup.value.PMPRJ_ID = ProjectId;

          let promise = new Promise((resolve, reject) => {
          this.service.postData(environment.searchProject, this.formGroup.value)
          .takeUntil(this.destroy$)
          .subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
              }
              else {
                this.formGroup.get('PMPRJ_ID').disable();
                this.formGroup.get('PMOP_ID').disable();
                res.data[0].PMPRJ_START_DATE = this.parseDate(res.data[0].PMPRJ_START_DATE);
                res.data[0].PMPRJ_END_DATE = this.parseDate(res.data[0].PMPRJ_END_DATE);
                this.formGroup.patchValue(res.data[0]);
              }
            });
            resolve();
          });
          return promise;
        }
      })

  }

  onSubmit() {
    
    if (!this.formGroup.invalid) {
      if (!this.showId) {
        this.formGroup.value.PMPRJ_ID = null;
      }
      this.formGroup.get('PMPRJ_ID').enable();
      this.formGroup.get('PMOP_ID').enable();
      this.formGroup.value.PMPRJ_START_DATE = this.formGroup.value.PMPRJ_START_DATE.year + '/' + this.formGroup.value.PMPRJ_START_DATE.month + '/' + this.formGroup.value.PMPRJ_START_DATE.day;
      this.formGroup.value.PMPRJ_END_DATE = this.formGroup.value.PMPRJ_END_DATE.year + '/' + this.formGroup.value.PMPRJ_END_DATE.month + '/' + this.formGroup.value.PMPRJ_END_DATE.day;
      
      let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.saveProject, this.formGroup.value).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'Saved succesfully', "Error", res.return_message);
            this.formGroup.get('PMPRJ_ID').disable();
            this.formGroup.get('PMOP_ID').disable();
            this.router.navigate(['/pages/projectmgmt/ProjectDetails'], { queryParams: { message: res.return_message } });
          }
        });
      resolve();
      });
      return promise;
    }
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

  onManagerChange(managerid) {
    this.managers.forEach((user) => {
      if (user.ID == managerid) {
        this.managerName = user.USERNAME
      }
    });
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
