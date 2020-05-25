import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { MaintainUserComponent } from './maintainuser/maintainuser.component';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { Dropdown, DropdownItem } from '../../../shared/dropdown/dropdown-item';
import { RadioButtonItem } from '../../../shared/dt-radio-button/radio-button-item';
import { CheckBoxItem } from '../../../shared/dt-checkbox/check-box-item';

@Component({
  selector: 'users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {
  selectedStatusOption: string = "Active";
  selectedLockOption: string = "Not Locked";

  user = {
    "SEUS_USER_ID": "",
    "SEUS_USER_NAME": "",
    "SEUS_EMAIL": "",
    "SEUS_IS_ACTIVE": this.selectedStatusOption,
    "SEUS_IS_LOCKED": this.selectedLockOption,
  };

  message: string = '';
  settings = {
    actions: false,
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
    hideSubHeader: true,
    columns: {
      SEUS_USER_NAME: {
        title: 'User Name',
        type: 'custom',
        filter: false,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/security/maintainuser",
            linkparam: { user_id: row.SEUS_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },
      SEUS_USER_ID: {
        title: 'User ID',
        type: 'string',
        filter: false,
      },
      SEUS_EMAIL: {
        title: 'Email ID',
        type: 'string',
        filter: false,
      },
      SEUS_IS_LOCKED: {
        title: 'Lock Status',
        type: 'string',
        filter: false,
      },
      SEUS_IS_ACTIVE: {
        title: 'User Status',
        type: 'string',
        filter: false,
      },

    },
  };

  formGroup: FormGroup;

  statusData: Dropdown = {
    data: [{
      key: 0,
      value: 'Active'
    }, {
      key: 1,
      value: 'In Active'
    }]
  };

  lockStatusData: Dropdown =
    {
      data: [{
        key: 0,
        value: 'Not Locked'
      }, {
        key: 1,
        value: 'Locked'
      }]
    };
 
    carOption: RadioButtonItem[] = [
    { name: 'BMW', value: 'BMW Val' },
    { name: 'Ford', value: 'Ford Val' }
  ];

  langList: CheckBoxItem[] = [
    {id: 1, name: 'Java'},
    {id: 2, name: 'TypeScript'},
    {id: 3, name: 'HTML'},
    {id: 4, name: 'JavaScript'},
]

  selectedCar: any = this.carOption[1].value ;
  lockStatus: DropdownItem = this.lockStatusData.data[0];
  selectStatus: DropdownItem = this.statusData.data[0];
  source: LocalDataSource = new LocalDataSource();
  selectedLang: CheckBoxItem[] ;

  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private formBuilder: FormBuilder,
    private toasterService: NbToastrService,) {  }
    
  onSearch() {
    var formdata;
    formdata = {
      "user": this.user
    };
    console.log(this.formGroup.value.selectedCar);
    console.log(this.formGroup.value.selectedLang);
    // this.user.SEUS_IS_ACTIVE = this.selectedStatusOption;
    this.user.SEUS_IS_ACTIVE = this.formGroup.value.dropdownStatus.value;
    this.user.SEUS_IS_LOCKED = this.formGroup.value.lockStatus.value;
    formdata = {
      "user": this.user
    };
    this.service.postData(environment.searchUsers, formdata).subscribe(
      (res: Res) => {
        if (res.return_code != 0) {
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.source.load(res.data);
        }
      }
    );
  }

  getUsers() {
    this.service.getData('/api/getusers')
      .subscribe(
        (users: Res) => {
          this.source.load(users.data);
        }
      );
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      dropdownStatus: [this.selectStatus],
      lockStatus: [this.lockStatus],
      selectedCar: [this.selectedCar],
      selectedLang: [this.selectedLang],
    });
    this.route
      .queryParams
      .subscribe(params => {
        const message = params['message'];
        if (!this.commonfunctions.isUndefined(message) && message != "") {
          this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
        }
      });
    this.onSearch();
  }
}
