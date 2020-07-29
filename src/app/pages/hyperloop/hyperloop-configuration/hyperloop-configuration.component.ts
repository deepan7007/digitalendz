import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { DatePipe } from '@angular/common';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { FormsModule, ReactiveFormsModule, NgForm } from '@angular/forms';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';


@Component({
  selector: 'hyperloop-configuration',
  templateUrl: './hyperloop-configuration.component.html',
  styleUrls: ['./hyperloop-configuration.component.scss']
})
export class HyperloopConfigurationComponent implements OnInit {

  jobtypes = ["Regular", "OnDemand"];
  jobtype = "";
  servers = ["Pabbu AWS", "Sathesh AWS", "Sakthi AWS", "Dedicated", "Master DB"];
  server = "";
  data;
  editmode = false;
  private destroy$ = new Subject();
  showBody: boolean;
  offsetconfigform: FormGroup;
  id: any;

  offsetSettings = {
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
      currency: {
        title: "Currency",
        editable: false,
      },
      order_type: {
        title: "Order Type",
        type: 'string',
      },
      units: {
        title: "Units",
        type: 'string',
      },
      buy_limit: {
        title: "Buy Limit",
        type: 'string',
      },
      buy_tp: {
        title: "Buy TP",
        type: 'string',
      },
      buy_sl: {
        title: "Buy SL",
        type: 'string',
      },
      sell_limit: {
        title: "Sell Limit",
        type: 'string',
      },
      sell_tp: {
        title: "Sell TP",
      },
      sell_sl: {
        title: "Sell SL",
        type: 'string',
      },
      buy_offset: {
        title: "Buy Offset",
      },
      sell_offset: {
        title: "Sell Offset",
        type: 'string',
      },
      rev_offset: {
        title: "Reverse Offset",
        type: 'string',
      },
      active: {
        title: "Acc Status",
        type: 'string'
      },
      allowed_percentages: {
        title: "Allowed Percentages",
      },
      trend_offset: {
        title: "Trend Offset",
        type: 'string'
      },
    },
  };
  offsetSource: LocalDataSource = new LocalDataSource();
  loading: boolean;

  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    public datepipe: DatePipe) { }

  ngOnInit() {
  }

  onSearch() {
    this.loading = true;
    let promise = new Promise((resolve, reject) => {
    this.service.postData(environment.getConfig, { job: this.jobtype, server: this.server })
      .takeUntil(this.destroy$)
      .subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            if (res.data.length === 0) {
              this.commonfunctions.showToast(this.toasterService, "warning", "Warning", "No data avaialble for the Currency");
              return;
            }
            this.offsetSource.load(res.data);
            this.loading = false;
            this.showBody = true;
            // this.data = JSON.parse(JSON.stringify(res.data));
            // this.showBody = true;

            // this.id = this.data.id;
            // this.offsetconfigform.controls['instrumentControl'].setValue(this.data.currency);
            // this.offsetconfigform.controls['ordertypeControl'].setValue(this.data.order_type);
            // this.offsetconfigform.controls['unitControl'].setValue(this.data.units);
            // this.offsetconfigform.controls['buylimitControl'].setValue(this.data.buy_limit);
            // this.offsetconfigform.controls['buytpControl'].setValue(this.data.buy_tp);
            // this.offsetconfigform.controls['buyslControl'].setValue(this.data.buy_sl);
            // this.offsetconfigform.controls['selllimitControl'].setValue(this.data.sell_limit);
            // this.offsetconfigform.controls['selltpControl'].setValue(this.data.sell_tp);
            // this.offsetconfigform.controls['sellslControl'].setValue(this.data.sell_sl);
            // this.offsetconfigform.controls['buyoffsetControl'].setValue(this.data.buy_offset);
            // this.offsetconfigform.controls['selloffsetControl'].setValue(this.data.sell_offset);
            // this.offsetconfigform.controls['revoffsetControl'].setValue(this.data.rev_offset);
            // this.offsetconfigform.controls['allowedpercentageControl'].setValue(this.data.allowed_percentages);
            // this.offsetconfigform.controls['trendchkcfgControl'].setValue(this.data.trend_offset);
            // this.offsetconfigform.updateValueAndValidity();
          }
        });
        resolve();
      });
      return promise;
  }

  onOffsetSettingsConfirm(event) {
    this.loading = true;
    var data = {
          id: event.newData.id,
          jobType: this.jobtype || "Regular",
          server: this.server,
          currency: event.newData.currency,
          order_type: event.newData.order_type,
          units: event.newData.units,
          buy_limit: event.newData.buy_limit,
          buy_tp: event.newData.buy_tp,
          buy_sl: event.newData.buy_sl,
          sell_limit: event.newData.sell_limit,
          sell_tp: event.newData.sell_tp,
          sell_sl: event.newData.sell_sl,
          buy_offset: event.newData.buy_offset,
          sell_offset: event.newData.sell_offset,
          rev_offset: event.newData.rev_offset,
          allowed_percentages: event.newData.allowed_percentages,
          trend_offset: event.newData.trend_offset,
        }

      this.service.postData(environment.updateConfig, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "success", "Error", "Unable to retrieve the data");
            } else {
              this.loading = false;
              this.onSearch();
              this.commonfunctions.showToast(this.toasterService, "success", "Updated", "Account Details updated successfully");
            }
          });
    event.confirm.resolve(event.newData);
  }

  
  onOffsetCreateConfirm(event) {
    this.loading = true;
    var data = {
          jobType: this.jobtype || "Regular",
          server: this.server,
          currency: event.newData.currency,
          order_type: event.newData.order_type,
          units: event.newData.units,
          buy_limit: event.newData.buy_limit,
          buy_tp: event.newData.buy_tp,
          buy_sl: event.newData.buy_sl,
          sell_limit: event.newData.sell_limit,
          sell_tp: event.newData.sell_tp,
          sell_sl: event.newData.sell_sl,
          buy_offset: event.newData.buy_offset,
          sell_offset: event.newData.sell_offset,
          rev_offset: event.newData.rev_offset,
          allowed_percentages: event.newData.allowed_percentages,
          trend_offset: event.newData.trend_offset,
        }

      this.service.postData(environment.insertConfig, data)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res: Res) => {
            if (res.return_code != 0) {
              this.commonfunctions.showToast(this.toasterService, "success", "Error", "Unable to retrieve the data");
            } else {
              this.loading = false;
              this.onSearch();
              this.commonfunctions.showToast(this.toasterService, "success", "Updated", "Account Details updated successfully");
            }
          });
    event.confirm.resolve(event.newData);
  }
}
