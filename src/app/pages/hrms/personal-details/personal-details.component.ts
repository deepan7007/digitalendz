import { Component, OnInit, EventEmitter, Output, Input, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormControl,  Validators } from '@angular/forms';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { environment } from '../../../../environments/environment';
import 'rxjs/add/observable/of';
import { Router } from '@angular/router';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { NbToastrService } from '@nebular/theme';
import { Res } from '../../../common/http/models/res.model';


@Component({
  selector: 'personal-details',
  templateUrl: './personal-details.component.html',
  styleUrls: ['./personal-details.component.scss']
})

export class PersonalDetailsComponent implements OnInit {
  @Input() employee_id: string;
  @Output() nextab: EventEmitter<any> = new EventEmitter<any>();

  emp_id: string = "";
  editmode: boolean;
  sequenceTypeVisible: boolean = true;
  personaldetailsform: FormGroup;
  autoCreateUser = [];
  sequenceType = [];
  sequence = [];
  companies = [];
  depts = [];
  designations = [];
  roles = [];
  users = [];
  company = [];

  empIdVisibility = false;
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private router: Router,
    private toasterService: NbToastrService) { }
  @ViewChild('firstname', {static: false}) firstnameref: ElementRef;
  getMetaData() {
    let promise = new Promise((resolve, reject) => {


      var filters = [{
        name: "module",
        value: "HRMS"
      },
      {
        name: "submodule",
        value: "EMPLOYEE"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);

            this.commonfunctions.extractMetaData(metadata, 'HRMS', 'EMPLOYEE', 'AUTO_CREATE_USER').then(
              autocreatedata => {
                this.autoCreateUser = autocreatedata[0];
                this.personaldetailsform.patchValue({
                  autoCreateUserControl: autocreatedata[1]
                });
              });
            this.commonfunctions.extractMetaData(metadata, 'HRMS', 'EMPLOYEE', 'SEQUENCE_TYPE').then(
              sequencetypedata => {
                this.sequenceType = sequencetypedata[0];
                this.personaldetailsform.patchValue({
                  sequenceTypeControl: sequencetypedata[1],

                });
              });
            this.service.postData(environment.getMetadataFromTable, { dbname: "system", tablename: "sys_sesq_autosequence", columnname: "SESQ_SEQUENCE" })
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.sequence = metadata;
                  var i = -1;
                  this.sequence.forEach(element => {
                    i++;
                    if (element.id == 'ALL') {
                      this.sequence.splice(i, 1);
                    }
                  });

                  this.personaldetailsform.patchValue({
                    sequenceControl: this.sequence[0],

                  });

                });

            var formdata = {
              path: this.router.url.split('?')[0],
              all_flag: "N"
            }
            this.service.postData(environment.getCompanies, formdata)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  var metadata = JSON.parse(string);
                  this.companies = metadata;

                });
            resolve();

          }
        );
    });
    return promise;
  }
  onCompanyChange() {
    let promise = new Promise((resolve, reject) => {
      var formdata = {
        company_id: this.personaldetailsform.get('companyControl').value,
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
        company_id: this.personaldetailsform.get('companyControl').value,
        dept_id: this.personaldetailsform.get('deptControl').value,
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
        company_id: this.personaldetailsform.get('companyControl').value,
        designation_id: this.personaldetailsform.get('designationControl').value,
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
  onUserChange() {
    let promise = new Promise((resolve, reject) => {
      if (this.personaldetailsform.get('managerControl').value != null) {

        if (this.personaldetailsform.get('managerControl').value.length >= 3) {
          var formData = {
            username: this.personaldetailsform.get('managerControl').value
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
      resolve();
    });
    return promise;
  }
  onManagerChange(managerid) {
    this.users.forEach((user) => {
      if (user.ID == managerid) {
        this.personaldetailsform.patchValue({
          managerNameControl: user.USERNAME

        });
      }
    });

  }
  setEmployeeDetail(emp_id) {
    var filters = [{
      name: "emp_id",
      value: emp_id
    }];

    this.service.getDatawithFilters(environment.getPersonalDetails, filters)
      .subscribe(
        (empDetails: Res) => {
          var string = JSON.stringify(empDetails.data);
          var personaldata = JSON.parse(string);
          this.personaldetailsform.setValue({
            empIdControl: emp_id,
            companyControl: personaldata[0].PRCM_COMPANY_NAME,
            deptControl: personaldata[0].EMPH_DEPT,
            designationControl: personaldata[0].EMPH_DESIGNATION,
            roleControl: personaldata[0].EMPH_ROLE,
            managerControl: personaldata[0].EMPH_MANAGER_ID,
            managerNameControl: personaldata[0].EMPH_MANAGER_NAME,
            firstnameControl: personaldata[0].EMPH_FIRSTNAME,
            middlenameControl: personaldata[0].EMPH_MIDNAME,
            lastnameControl: personaldata[0].EMPH_LASTNAME,
            emailFormControl: personaldata[0].EMPH_EMAIL,
            dobFormControl: personaldata[0].EMPH_DATEOFBIRTH,
            dojFormControl: personaldata[0].EMPH_DATEOFJOINING,
            loginIdControl: personaldata[0].SEUS_USER_ID,
            sequenceTypeControl: personaldata[0].EMPH_SEQUENCE_TYPE,
            autoCreateUserControl: personaldata[0].EMPH_AUTOCREATE_LOGIN,
            sequenceControl: personaldata[0].EMPH_DEFAULT_SECURITROLE,
          });
          this.onCompanyChange().then(() => {
            this.personaldetailsform.patchValue({
              deptControl: personaldata[0].EMPH_DEPT

            });
            this.onDeptChange().then(() => {
              this.personaldetailsform.patchValue({
                designationControl: personaldata[0].EMPH_DESIGNATION,
              });
              this.onDesignationChange().then(() => {
                this.personaldetailsform.patchValue({
                  roleControl: personaldata[0].EMPH_ROLE,
                });
              });
            });
          });
          this.sequenceTypeVisible = false;
        }
      );
  }

  ngOnInit() {
    this.personaldetailsform = new FormGroup({
      empIdControl: new FormControl(),
      companyControl: new FormControl('', Validators.required),
      deptControl: new FormControl('', Validators.required),
      designationControl: new FormControl('', Validators.required),
      roleControl: new FormControl('', Validators.required),
      managerControl: new FormControl('', Validators.required),
      managerNameControl: new FormControl('', Validators.required),
      sequenceTypeControl: new FormControl(),
      autoCreateUserControl: new FormControl(),
      loginIdControl: new FormControl(),
      sequenceControl: new FormControl('', Validators.required),
      firstnameControl: new FormControl('', Validators.required),
      middlenameControl: new FormControl(),
      lastnameControl: new FormControl('', [Validators.required]),
      emailFormControl: new FormControl('', [Validators.required, Validators.email]),
      //dobFormControl: new FormControl('', [Validators.required, Validators.pattern(/^02\/(?:[01]\d|2\d)\/(?:19|20)(?:0[048]|[13579][26]|[2468][048])|(?:0[13578]|10|12)\/(?:[0-2]\d|3[01])\/(?:19|20)\d{2}|(?:0[469]|11)\/(?:[0-2]\d|30)\/(?:19|20)\d{2}|02\/(?:[0-1]\d|2[0-8])\/(?:19|20)\d{2}$/)]),
      dobFormControl: new FormControl({ disabled: true }, [Validators.required]),
      dojFormControl: new FormControl({ disabled: true }, [Validators.required]),

    });

    this.personaldetailsform.get('sequenceTypeControl').valueChanges.subscribe(

      (sequenceTypeControl: string) => {

        if (sequenceTypeControl === 'AUTO') {
          this.personaldetailsform.get('empIdControl').setValidators([]);
          this.empIdVisibility = false;

        } else {

          this.personaldetailsform.get('empIdControl').setValidators([Validators.required]);
          this.empIdVisibility = true;

        }

        this.personaldetailsform.get('empIdControl').updateValueAndValidity();

      }

    )
    this.getMetaData().then(
      () => {
        this.emp_id = this.employee_id;
        if (!this.commonfunctions.isUndefined(this.employee_id) && this.employee_id != "") {
          this.setEmployeeDetail(this.employee_id);
          this.editmode = true;
        }
      });

  }



  onSubmit(f) {

    if (f.invalid) {
      this.commonfunctions.showToast(this.toasterService, "error", "Error", "Please correct the errors before saving");
    }
    else {
      var formdata = {
        emp_id: this.personaldetailsform.get('empIdControl').value,
        firstname: this.personaldetailsform.get('firstnameControl').value,
        middlename: this.personaldetailsform.get('middlenameControl').value,
        lastname: this.personaldetailsform.get('lastnameControl').value,
        email: this.personaldetailsform.get('emailFormControl').value,
        dob: this.personaldetailsform.get('dobFormControl').value,
        doj: this.personaldetailsform.get('dojFormControl').value,
        manager_id: this.personaldetailsform.get('managerControl').value,
        sequenceType: this.personaldetailsform.get('sequenceTypeControl').value,
        autoCreateUser: this.personaldetailsform.get('autoCreateUserControl').value,
        designation: this.personaldetailsform.get('designationControl').value,
        dept: this.personaldetailsform.get('deptControl').value,
        company: this.personaldetailsform.get('companyControl').value,
        role: this.personaldetailsform.get('roleControl').value,
        //securityRole: this.personaldetailsform.get('securityRoleControl').value,
        sequence: this.personaldetailsform.get('sequenceControl').value,
        loginId: this.personaldetailsform.get('loginIdControl').value,
        mode: this.editmode ? 'M' : 'C',
      }
      this.service.postData(environment.saveEmpPersonalDetails, formdata).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            this.firstnameref.nativeElement.focus();
          }
          else {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", "Personal Details Saved successfully for the EMP ID: " + res.data[0].EMP_ID);
            this.emp_id = res.data[0].EMP_ID;
            this.sequenceTypeVisible = false;
            this.personaldetailsform.patchValue({
              loginIdControl: res.data[0].USER_ID,

            });
            this.nextab.emit(this.emp_id);
          }
        }
      );
    }
  }
}
