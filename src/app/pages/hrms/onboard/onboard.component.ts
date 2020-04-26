import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { OnboardService } from './onboard.service';
import { NbToastrService } from '@nebular/theme';
import { Res } from '../../../common/http/models/res.model';


@Component({
  selector: 'onboard',
  templateUrl: './onboard.component.html',
  styleUrls: ['./onboard.component.scss']
})
export class OnboardComponent implements OnInit {

  @ViewChild('education', {static: false}) el: ElementRef;
  submitted: boolean = false;
  create: boolean = true;
  isEmpIdGenerated: boolean;
  messages: any = {};
  editmode: boolean;
  constructor(
    private _fb: FormBuilder,
    private service: HttpClientService,
    private router: Router,
    private dataSharingService: OnboardService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute
  ) {
    this.dataSharingService.isEmpIdGenerated.subscribe(value => {
      this.isEmpIdGenerated = value;
    });
  }



  tabs = [
    {
      title: 'Personal Details',
      active: true
    },
    {
      title: 'Address Details',
      active: false
    },
    {
      title: 'Education Qualification',
      active: false
    },
    {
      title: 'Employement History',
      active: false
    },
    {
      title: 'Attachment Details',
      active: false
    },
   
  ];
  emp_id: string;
  onNext(emp_id, tab) {
    if (tab == 0) {
      this.emp_id = emp_id;
      this.dataSharingService.isEmpIdGenerated.next(true);
      this.tabs[tab].active = false;
      this.tabs[tab + 1].active = true;
    }
    else {
      this.tabs[tab].active = false;
      this.tabs[tab + 1].active = true;
    }

  }



  ngOnInit() {
    this.isEmpIdGenerated = false;
    this.route
      .queryParams
      .subscribe(params => {
        const emp_id = params['emp_id'];

        if (!this.commonfunctions.isUndefined(emp_id) && emp_id != "") {
          this.emp_id = emp_id;
          this.dataSharingService.isEmpIdGenerated.next(true);
          this.editmode = true;
        }
        else {
          this.editmode = false;
        }
      })
  }

  // Current ROle

  onCurrentRoleSubmit(ee: NgForm) {

    if (ee.valid) {
      /*    this.service.postData('/api/saveCurrentRoleDetails', f.value).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.messages = [res.return_message];
                this.submitted = true;
              } else {
                this.messages = [res.return_message];
                this.submitted = true;
              
            }
          );*/
    }
  }

  // save Functionality
  onSubmit(form: NgForm) {

    if (form.valid && form.value.firstName != '') {
      this.service.postData('/api/savePersonalDetails', form.value).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.messages = [res.return_message];
            this.submitted = true;
          } else {
            this.messages = [res.return_message];
            this.submitted = true;
          }
        }
      );
    }
    else if (form.valid && form.value.institutionName != '') {
      this.service.postData('/api/saveEductionDetails', form.value).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.messages = [res.return_message];
            this.submitted = true;
          } else {
            this.messages = [res.return_message];
            this.submitted = true;
          }
        }
      );
    }
    else if (form.valid && form.value.employeeName != '') {
      this.service.postData('/api/saveEmploymentDetails', form.value).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.messages = [res.return_message];
            this.submitted = true;
          } else {
            this.messages = [res.return_message];
            this.submitted = true;
          }
        }
      );
    }
    else if (form.valid && form.value.currentDesignation != '') {
      this.service.postData('/api/saveCurrentRoleDetails', form.value).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.messages = [res.return_message];
            this.submitted = true;
          } else {
            this.messages = [res.return_message];
            this.submitted = true;
          }
        }
      );
    }

  }

}
