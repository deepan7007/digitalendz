import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Location } from '@angular/common';
import { UsersModalComponent } from '../../users/users-modal/users-modal.component';
import { CommonFunctions } from '../../../../common/service/commonfunctions.service';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

import { RoleDetails } from './roledetails.model';
import { Module } from './module.model';
import { environment } from '../../../../../environments/environment';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { SmartTable } from '../../../../common/smartable/service/smarttable.servics';
import { NbToastrService, NbDialogService, NbDialogRef } from '@nebular/theme';
import { Res } from '../../../../common/http/models/res.model';
import { ModulesComponent } from '../../modules/modules.component';
@Component({
  selector: 'maintainrole',
  templateUrl: './maintainrole.component.html',
  styleUrls: ['./maintainrole.component.scss']
})
export class MaintainroleComponent implements OnInit {
  @ViewChild('rolename', { static: false }) rolenameref: ElementRef;
  @ViewChild('roledescription', { static: false }) roledescriptionref: ElementRef;
  companies = [];
  moduledata = [];
  userdata = [];
  usersource: LocalDataSource = new LocalDataSource();
  modulesource: LocalDataSource = new LocalDataSource();
  searchmodulesource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private smartTable: SmartTable,
    private modalService: NbDialogService,
    private toasterService: NbToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private location: Location) {

  }

  message: string = '';
  maintainroleform: FormGroup;
  role = {
    "SERO_ID": "",
    "SERO_ROLE_DESCRIPTION": "",
    "SERO_ROLE_NAME": "",
    "SERO_COMPANY": ""
  };
  modulesettings = {
    actions: {
      add: false, edit: false, delete: true, position: 'right'
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
    columns: {
      SEMO_ID: {
        title: 'SEMO_ID',
        type: 'number',
      },
      SEMO_MODULE_NAME: {
        title: 'Module Name',
        type: 'string',
      },
      SEMO_DESCRIPTION: {
        title: 'Description',
        type: 'string',
      },
    },
  };
  usersettings = {
    actions: {
      add: false, edit: false, delete: true, position: 'right'
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
    columns: {
      SEUS_ID: {
        title: 'SEUS ID',
        type: 'string',
      },
      SEUS_USER_NAME: {
        title: 'User Name',
        type: 'string',
      },
      SEUS_USER_ID: {
        title: 'User ID',
        type: 'string',
      },
    },
  };


  getMetaData() {
    let promise = new Promise((resolve, reject) => {
      var formdata = {
        path: this.router.url.split('?')[0]
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
    return promise;
  }


  onCancel(): void {
    this.location.back();

  }

  onModuleDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      var deletedrow = [{
        "SEMO_MODULE_NAME": event.data.SEMO_MODULE_NAME,
        "SEMO_DESCRIPTION": event.data.SEMO_DESCRIPTION,
        "SEMO_ID": event.data.SEMO_ID
      }];
      this.smartTable.deleteRows(this.moduledata, deletedrow, "SEMO_MODULE_NAME").subscribe(
        (data: any[]) => {
          this.moduledata = data;
        });
    } else {
      event.confirm.reject();
    }
  }
  onUserDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
      var deletedrow = [{
        "SEUS_USER_NAME": event.data.SEUS_USER_NAME,
        "SEUS_USER_ID": event.data.SEUS_USER_ID,
        "SEUS_ID": event.data.SEUS_ID
      }];
      this.smartTable.deleteRows(this.userdata, deletedrow, "SEUS_USER_ID").subscribe(
        (data: any[]) => {
          this.userdata = data;
        });
    } else {
      event.confirm.reject();
    }
  }

  onSave(): void {

    if (this.maintainroleform.invalid) {
      this.commonfunctions.validateAllFormFields(this.maintainroleform);
      if (this.maintainroleform.controls.rolename.invalid) {
        this.rolenameref.nativeElement.focus();
      }
      else if (this.maintainroleform.controls.roledescription.invalid) {
        this.roledescriptionref.nativeElement.focus();
      }
      return;
    }
    var formdata;
    formdata = {
      "role": this.role,

      "module": this.moduledata,
      "user": this.userdata,
    };
    this.service.postData(environment.saveRole, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          this.rolenameref.nativeElement.focus();
        }
        else {
          this.router.navigate(['/pages/security/roles'], { queryParams: { message: res.return_message } });
        }
      }
    );
  }
  
  showModuleModal() {
    this.modalService.open(ModulesComponent)
      .onClose.subscribe((result: LocalDataSource) => {
        this.smartTable.getNewRows(this.modulesource, result, "SEMO_MODULE_NAME").subscribe(
          (newrows: Module[]) => {
            newrows.forEach(element => {
              this.modulesource.append(element);
              this.moduledata.push(element);
            });
          });
      });


  };

  showUserModal() {
    this.modalService.open(UsersModalComponent)
      .onClose.subscribe((result: LocalDataSource) => {
        //load from search
        this.smartTable.getNewRows(this.usersource, result, "SEUS_USER_ID").subscribe(

          (newrows: Module[]) => {
            newrows.forEach(element => {
              this.usersource.append(element);
              this.userdata.push(element);
            });
         });

      });

  };
  setRoleDetail(role_id) {
    var filters = [{
      name: "role_id",
      value: role_id
    }];
    this.service.getDatawithFilters(environment.getRole, filters)
      .subscribe(
        (roledetails: Res) => {
          var string = JSON.stringify(roledetails.data);
          var roledata: RoleDetails = JSON.parse(string);
          this.role = roledata.role[0];
          this.modulesource.load(roledata.module);
          this.usersource.load(roledata.user);
        }
      );
  }
  ngOnInit() {

    this.getMetaData().then(() => {
      this.maintainroleform = new FormGroup({
        rolename: new FormControl('', [Validators.required, Validators.pattern(/^\S*$/)]),
        roledescription: new FormControl('', Validators.required),
        company: new FormControl('', Validators.required)
      });
      this.route
        .queryParams
        .subscribe(params => {
          const role_id = params['role_id'];

          if (!this.commonfunctions.isUndefined(role_id) && role_id != "") {
            this.setRoleDetail(role_id);
          }
        })
    });
  }



}
