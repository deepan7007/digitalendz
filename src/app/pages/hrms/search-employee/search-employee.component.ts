import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators, NgForm } from '@angular/forms';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { NbToastrService } from '@nebular/theme';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { DatePickerComponent } from '../../../shared/date-picker/date-picker.component';

@Component({
  selector: 'search-employee',
  templateUrl: './search-employee.component.html',
  styleUrls: ['./search-employee.component.scss']
})
export class SearchEmployeeComponent implements OnInit {
  selectedStatusOption: string = "Active";
  selectedLockOption: string = "Not Locked" ;
  DatePickerComponent;
  employee = {
    EMPH_ID :  '',
    EMPH_FIRSTNAME :  '',
    EMPH_MIDNAME :  '',
    EMPH_LASTNAME :  '',
    EMPH_DATEOFBIRTH :  null,
    EMPH_DATEOFJOINING :  null,
    EMPH_DESIGNATION :  '',
    EMPH_MANAGER_ID :  '',
    EMPH_ROLE :  '',
    EMPH_SHIFT :  '',
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
    //hideSubHeader :true,
    columns: {
      EMPH_ID: {
        title: 'Employee ID',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/hrms/maintainEmployee",
            linkparam: { emp_id: row.EMPH_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent

      },
      EMPH_FIRSTNAME: {
        title: 'First Name',
        type: 'string',
      },
      EMPH_LASTNAME: {
        title: 'Last Name',
        type: 'string',
      },
      EMPH_DESIGNATION: {
        title: 'Designation',
        type: 'string',
      },
      EMPH_DATEOFBIRTH: {
        title: 'Date of Birth',
        type: 'string',
      },
      EMPH_DATEOFJOINING: {
        title: 'Date of Joining',
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
   
  }
  onSearch() {
    var formdata;
    formdata = {
      "employee": this.employee
     
    };
    // console.log(this.employee);
    this.service.postData(environment.searchEmployee, formdata).subscribe(
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

  ngOnInit() {
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
  onDateUpdate(date)
  {
     this.employee.EMPH_DATEOFBIRTH = date;
  }
}
