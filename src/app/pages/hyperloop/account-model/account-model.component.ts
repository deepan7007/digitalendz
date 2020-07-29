import { Component, OnInit } from '@angular/core';
import { ButtonViewComponent } from '../../../common/smartable/component/button-view/button-view.component';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'account-model',
  templateUrl: './account-model.component.html',
  styleUrls: ['./account-model.component.scss']
})
export class AccountModelComponent implements OnInit {
  loading = false;
  servers = ["Pabbu AWS", "Sathesh AWS", "Sakthi AWS", "Dedicated", "Master DB"];
  server = "";
  private destroy$ = new Subject();
  accountSettings = {
    actions: { delete: false },
    pager: {
      perPage: 50,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      //confirmDelete: false,
    },
    attr: {
      // class: 'table table-bordered'
    },
    // hideSubHeader :true,

    columns: {
      account_id: {
        title: "Account ID",
        type: 'string',
      },
      account_url: {
        title: "Oanda URL",
        type: 'string',
        editable: false
      },
      account_domain: {
        title: "Oanda Domain",
        type: 'string',
        editable: false
      },
      account_key: {
        title: "Oanda Key",
        type: 'string',
        editable: false
      },
      account_status: {
        title: "Account Status",
        type: 'string',
      },
      account_type: {
        title: "Account Type",
        type: 'string',
      },
      account_rev_type: {
        title: "Account Rev Type",
        editable: false
      },
      account_env: {
        title: "Environment",
        editable: false
      },
      account_alias: {
        title: "Alias",
        type: 'string',
      },
      account_mode: {
        title: "Model Mode",
        type: 'string'
      },
    },
  };
  accountSource: LocalDataSource = new LocalDataSource();
  showBody = false;
  constructor(private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService) { }

  ngOnInit() {
    
  }

  getAccounts() {
    this.loading = true;
    this.accountSource.empty();
    let promise = new Promise((resolve, reject) => {
      var formdata = {
        server: this.server
      }

      this.service.postData(environment.getAccounts, formdata)
      .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.loading = false;
              this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
            }
            else {
              this.accountSource.load(res.data);
              this.loading = false;
              this.showBody = true;
            }
          });
      resolve();
    });
    return promise;
  }

  onAccountSettingsConfirm(event) {
      this.loading = true;
      var data = {
        server: this.server,
        id: event.newData.id,
        account_id: event.newData.account_id,
        account_url: event.newData.account_url,
        account_domain: event.newData.account_domain,
        account_key: event.newData.account_key,
        account_status: event.newData.account_status,
        account_type: event.newData.account_type,
        account_rev_type: event.newData.account_rev_type,
        account_env: event.newData.account_env,
        account_alias: event.newData.account_alias,
        account_mode: event.newData.account_mode,
      }

      this.service.postData(environment.updateAccounts, data)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (res: Res) => {

          if (res.return_code != 0) {
            this.loading = false;
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.loading = false;
            this.getAccounts();
            this.commonfunctions.showToast(this.toasterService, "success", "Updated", "Account Details updated successfully");
          }
        }
      );
      event.confirm.resolve(event.newData);
  }
  
  
  onAccountCreateConfirm(event) {
    this.loading = true;
    var data = {
      server: this.server,
      account_id: event.newData.account_id,
      account_url: event.newData.account_url,
      account_domain: event.newData.account_domain,
      account_key: event.newData.account_key,
      account_status: event.newData.account_status,
      account_type: event.newData.account_type,
      account_rev_type: event.newData.account_rev_type,
      account_env: event.newData.account_env,
      account_alias: event.newData.account_alias,
      account_mode: event.newData.account_mode,
    }

    this.service.postData(environment.insertAccount, data)
    .pipe(takeUntil(this.destroy$))
    .subscribe(
      (res: Res) => {

        if (res.return_code != 0) {
          this.loading = false;
          this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
        }
        else {
          this.loading = false;
          this.getAccounts();
          this.commonfunctions.showToast(this.toasterService, "success", "Updated", "Account Details updated successfully");
        }
      }
    );
    event.confirm.resolve(event.newData);
}
}
