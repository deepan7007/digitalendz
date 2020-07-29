import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { ActivatedRoute } from '@angular/router';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { ToasterService, ToasterConfig, Toast, BodyOutputType } from 'angular2-toaster';
import { environment } from '../../../../environments/environment';
import { MetaData } from '../../../common/models/metadata.model';
import { Filter } from '../../../common/http/Models/filter.model';
import { Res } from '../../../common/http/models/res.model';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { NbTokenService } from '@nebular/auth';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'hyper-loop-dashboard',
  templateUrl: './hyper-loop-dashboard.component.html',
  styleUrls: ['./hyper-loop-dashboard.component.scss']
})
export class HyperLoopDashboardComponent implements OnInit {

  stocksList = [{ STKM_CODE: "Select Stock Name" }];
  accounts = [];
  accountsDefault = 'ALL';
  stocksDefault = "Select Stock Name";
  stockTrendDate = null;
  stockData: any[];
  buysellflag: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  daterange: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  env_type: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  account_mode: MetaData = { selectedOption: { id: "", name: "" }, availableOptions: [{ id: "", name: "" }] };
  showcancel = [];
  showcancelDefault = 'N';
  tradeDashboardFormGroup: FormGroup;
  ordersource: LocalDataSource = new LocalDataSource();
  orderSummarySource: LocalDataSource = new LocalDataSource();
  summary = [];
  buy_pl = 0;
  sell_pl = 0;
  buy_cnt = 0;
  sell_cnt = 0;
  model1_pl = 0;
  model1_winner = 0;
  model1_loser = 0;
  model2_pl = 0;
  model2_winner = 0;
  model2_loser = 0;
  model3_pl = 0;
  model3_winner = 0;
  model3_loser = 0;
  loading = false;
  orderSummarySettings = {
    actions: false,
    rowClassFunction: (row) => {
      if (row.data.CUMULATIVE > 0) {
        return 'green';
      }
      else if (row.data.CUMULATIVE < 0) {
        return 'red';
      }


    },
    columns: {
      ACCOUNT_MODE: {
        title: 'Model'
      },
      STTR_REALIZED_PL: {
        title: 'Realized PL',
        valuePrepareFunction: (cell, row) => {
          return parseFloat(cell).toFixed(2);
        }

      },
      STTR_UNREALIZED_PL: {
        title: 'Un-Realized PL',
        valuePrepareFunction: (cell, row) => {
          return parseFloat(cell).toFixed(2);
        }
      },
      CUMULATIVE: {
        title: 'Cumulative',
        valuePrepareFunction: (cell, row) => {
          return parseFloat(cell).toFixed(2);
        }
      },
      WINNER: {
        title: 'Winner',
      },
      LOSER: {
        title: 'Loser',
      },
      COMPLETED_TRADES: {
        title: 'Completed Trades',
      },
      INPROGRESS_TRADES: {
        title: 'In Progress Trades',
      },
      DESCRIPTION: {
        title: 'Description',
      }
    }
  }
  ordersettings = {
    actions: false,

    // hideSubHeader :true,
    pager: {
      perPage: 50,
    },
    rowClassFunction: (row) => {
      if (row.data.WIN_LOSS_FLAG == 'ENTERED') {
        return 'yellow';
      }
      else if (row.data.STTR_REALIZED_PL < 0) {
        return 'red';
      }
      else if (row.data.STTR_REALIZED_PL > 0) {
        return 'green';
      }


    },
    columns: {
      STAC_ACCOUNT_ID: {
        title: 'Account ID'
      },
      ACCOUNT_ALIAS: {
        title: 'Account Name'
      },
      ACCOUNT_MODE: {
        title: 'Account Mode'
      },
      STKM_CODE: {
        title: 'Currency Code'
      },
      STOR_TRADE_DATE: {
        title: 'Trade Date',
      },
      BUY_SELL_FLAG: {
        title: 'Buy\\Sell Flag',
      },
      STOR_ORDER_ID: {
        title: 'Order Id',
      },
      WIN_LOSS_FLAG: {
        title: "Win Loss Flag",
      },
      EXIT_TYPE: {
        title: 'Order Close Type'
      },
      STOR_UNITS: {
        title: 'Units',
      },
      STTR_REALIZED_PL: {
        title: 'Realized PL',
      },
      STTR_UNREALIZED_PL: {
        title: 'Un-Realized PL',
      },
      STTR_STATE: {
        title: "Trade State",
      },
      STOR_STATE: {
        title: "Order State"
      },
      STOR_PRICE: {
        title: "Entry Price",
        valuePrepareFunction: (cell, row) => {
          return row.STTR_PRICE == null ? row.STOR_PRICE : row.STTR_PRICE
        }
      },
      STOR_TP_PRICE: {
        title: 'TP Price',
        valuePrepareFunction: (cell, row) => {
          return row.STTR_TP_PRICE == null ? row.STOR_TP_PRICE : row.STTR_TP_PRICE
        }
      },
      STOR_SL_PRICE: {
        title: 'SL Price',
        valuePrepareFunction: (cell, row) => {
          return row.STTR_SL_PRICE == null ? row.STOR_SL_PRICE : row.STTR_SL_PRICE
        }
      },
      ORDER_TIME: {
        title: 'Order Time'
      },
      ENTRY_TIME: {
        title: 'Entry Time'
      },
      CLOSE_TIME: {
        title: 'Close Time'
      }

    }

  }
  constructor(
    private service: HttpClientService,
    private route: ActivatedRoute,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService) { }



  ngOnInit() {
    //this.getGroupingData();
    this.showcancel.push({ value: 'YES', id: 'Y' });
    this.showcancel.push({ value: 'No', id: 'N' });


    this.tradeDashboardFormGroup = new FormGroup({
      stock_code: new FormControl(Validators.required),
      buysellflag: new FormControl(this.buysellflag.selectedOption.id, Validators.required),
      daterange: new FormControl(this.daterange.selectedOption.id, Validators.required),
      env_type: new FormControl(this.env_type.selectedOption.id, Validators.required),
      account_mode: new FormControl(this.account_mode.selectedOption.id, Validators.required),
      showcancel: new FormControl(this.showcancelDefault, Validators.required),
      accounts: new FormControl(Validators.required),
      fromDate: new FormControl('', Validators.required),
      toDate: new FormControl('', Validators.required),

    });

    var today = new Date();
    this.tradeDashboardFormGroup.patchValue({
      fromDate: {
        "year": today.getFullYear(),
        "month": today.getMonth() + 1,
        "day": today.getDate(),
      },
      toDate: {
        "year": today.getFullYear(),
        "month": today.getMonth() + 1,
        "day": today.getDate(),
      }
    });
    this.getMetaData().then(async () => {
      this.route.queryParams
        .subscribe(params => {
          const message = params['message'];
          if (!this.commonfunctions.isUndefined(message) && message != "") {
            this.commonfunctions.showToast(this.toasterService, "success", "Success", params['message']);
          }
        });
      await this.loadStockAccounts();
      this.getOrderData();
    });

  }

  getMetaData() {
    let promise = new Promise((resolve, reject) => {

      this.service.postData(environment.getMetadataFromTable, { dbname: "stock", tablename: "stk_stkm_stock_master", columnname: "STKM_CODE" })
        .subscribe(
          (responseData: Res) => {
            var responseStr = JSON.stringify(responseData.data);
            var parsedResponse = JSON.parse(responseStr);
            this.stocksList = this.stocksList.concat(parsedResponse);
            this.tradeDashboardFormGroup.patchValue({
              stock_code: 'ALL'
            }
            );

          });


      var filters: Filter[] = [{
        name: "module",
        value: "STOCK"
      },
      {
        name: "submodule",
        value: "STOCK"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            metaData = JSON.parse(string);
            this.commonfunctions.getMetaData(metaData, 'STOCK', 'STOCK', 'BUY_SELL_TYPE').then(
              (metadata: MetaData) => {
                this.buysellflag = metadata;
                this.buysellflag.availableOptions.push({ id: 'ALL', name: 'ALL' })
                this.tradeDashboardFormGroup.patchValue(
                  { buysellflag: 'ALL' });
              });
          });
      var filters: Filter[] = [{
        name: "module",
        value: "REPORT"
      },
      {
        name: "submodule",
        value: "REPORT"
      },
      ];
      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getMetaData(metadata, 'REPORT', 'REPORT', 'REPORT_PERIOD').then(
              (metadata: MetaData) => {
                this.daterange = metadata;
                this.tradeDashboardFormGroup.patchValue(
                  { daterange: this.daterange.selectedOption.id });

              });
            var filters: Filter[] = [{
              name: "module",
              value: "STOCK"
            },
            {
              name: "submodule",
              value: "OANDA"
            },
            ];
            this.service.getDatawithFilters(environment.getMetaData, filters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  metaData = JSON.parse(string);
                  this.commonfunctions.getMetaData(metaData, 'STOCK', 'OANDA', 'HYPER_ENV_TYPE').then(
                    (metadata: MetaData) => {
                      this.env_type = metadata;
                      this.tradeDashboardFormGroup.patchValue(
                        { env_type: this.env_type.selectedOption.id });
                      resolve();
                    });
                });
            this.service.getDatawithFilters(environment.getMetaData, filters)
              .subscribe(
                (metaData: Res) => {
                  var string = JSON.stringify(metaData.data);
                  metaData = JSON.parse(string);
                  this.commonfunctions.getMetaData(metaData, 'STOCK', 'OANDA', 'HYPER_ACCOUNT_MODE').then(
                    (metadata: MetaData) => {
                      this.account_mode = metadata;
                      this.tradeDashboardFormGroup.patchValue(
                        { account_mode: this.account_mode.selectedOption.id });
                      resolve();
                    });
                });

          });

    });
    return promise;
  } //getMetaData

  async loadStockAccounts() {
    this.service.postData(environment.getStockAccountHyperSelect, { env_type: this.tradeDashboardFormGroup.get('env_type').value })
      .subscribe(
        (response: Res) => {
          if (response.return_code == 0) {
            var responseStr = JSON.stringify(response.data);
            var parsedResponse = JSON.parse(responseStr);
            this.accounts = this.accounts.concat(parsedResponse);
            this.tradeDashboardFormGroup.patchValue({
              accounts: 'ALL'
            });
          }
        });

  }
  getOrderData() {
    this.loading = true;

    var formdata = {
      stock_code: this.tradeDashboardFormGroup.get('stock_code').value,
      account_mode: this.tradeDashboardFormGroup.get('account_mode').value,
      buy_sell_flag: this.tradeDashboardFormGroup.get('buysellflag').value,
      daterange: this.tradeDashboardFormGroup.get('daterange').value,
      env_type: this.tradeDashboardFormGroup.get('env_type').value,
      showcancel: this.tradeDashboardFormGroup.get('showcancel').value,
      account_id: this.tradeDashboardFormGroup.get('accounts').value,
      fromdate: this.tradeDashboardFormGroup.get('fromDate').value.year + "-" + this.tradeDashboardFormGroup.get('fromDate').value.month +
        "-" + this.tradeDashboardFormGroup.get('fromDate').value.day,
      todate: this.tradeDashboardFormGroup.get('toDate').value.year + "-" + this.tradeDashboardFormGroup.get('toDate').value.month +
        "-" + this.tradeDashboardFormGroup.get('toDate').value.day,

    }

    this.service.postData(environment.getHyperorderDataSummary, formdata)
      .subscribe(
        (response: Res) => {
          if (response.return_code != 0) {
            this.loading = false;
            this.commonfunctions.showToast(this.toasterService, "error", "Error", response.return_message);
          }
          else {
            this.buy_pl = 0;
            this.sell_pl = 0;
            this.buy_cnt = 0;
            this.sell_cnt = 0;
            for (var i = 0; i < response.data.length; i++) {
              var data = response.data[i];
              if (data.BUY_SELL_FLAG == 'BUY') {
                this.buy_pl = this.buy_pl + data.STTR_REALIZED_PL;
                this.buy_cnt = this.buy_cnt + data.COMPLETED_TRADES;
              }
              else if (data.BUY_SELL_FLAG == 'SELL') {
                this.sell_pl = this.sell_pl + data.STTR_REALIZED_PL;
                this.sell_cnt = this.sell_cnt + data.COMPLETED_TRADES;

              }
            }
          }
        });
    this.service.postData(environment.getHyperorderData, formdata)
      .subscribe(
        (response: Res) => {
          if (response.return_code != 0) {
            this.loading = false;
            this.commonfunctions.showToast(this.toasterService, "error", "Error", response.return_message);
          }
          else {

            this.model1_pl = 0;
            this.model1_winner = 0;
            this.model1_loser = 0;
            this.model2_pl = 0;
            this.model2_winner = 0;
            this.model2_loser = 0;
            this.model3_pl = 0;
            this.model3_winner = 0;
            this.model3_loser = 0;
            this.summary = [];
            var summary_row = {
              ACCOUNT_MODE: "Summary",
              STTR_REALIZED_PL: 0,
              STTR_UNREALIZED_PL: 0,
              CUMULATIVE: 0,
              WINNER: 0,
              LOSER: 0,
              COMPLETED_TRADES: 0,
              INPROGRESS_TRADES: 0
            };
            for (var i = 0; i < response.data.length; i++) {
              var data = response.data[i];
              var exists = false;

              for (var index = 0; index < this.summary.length; index++) {
                if (this.summary[index].ACCOUNT_MODE == data.ACCOUNT_MODE) {
                  exists = true;
                  this.summary[index].STTR_REALIZED_PL = this.summary[index].STTR_REALIZED_PL + ((data.STTR_REALIZED_PL == null) ? 0 : data.STTR_REALIZED_PL);
                  this.summary[index].STTR_UNREALIZED_PL = this.summary[index].STTR_UNREALIZED_PL + ((data.STTR_UNREALIZED_PL == null) ? 0 : data.STTR_UNREALIZED_PL);
                  this.summary[index].CUMULATIVE = this.summary[index].STTR_REALIZED_PL + this.summary[index].STTR_UNREALIZED_PL;
                  this.summary[index].WINNER = this.summary[index].WINNER + ((parseInt(data.STTR_REALIZED_PL) >= 0) ? 1 : 0);
                  this.summary[index].LOSER = parseInt(this.summary[index].LOSER) + ((parseInt(data.STTR_REALIZED_PL) < 0) ? 1 : 0);
                  this.summary[index].COMPLETED_TRADES = parseInt(this.summary[index].COMPLETED_TRADES) + ((data.STTR_STATE == "CLOSED") ? 1 : 0);
                  this.summary[index].INPROGRESS_TRADES = parseInt(this.summary[index].INPROGRESS_TRADES) + ((data.STTR_STATE == "OPEN") ? 1 : 0)
                }
              }
              if (!exists) {
                var model_row = {
                  ACCOUNT_MODE: data.ACCOUNT_MODE,
                  DESCRIPTION: data.DESCRIPTION,
                  STTR_REALIZED_PL: ((data.STTR_REALIZED_PL == null) ? 0 : data.STTR_REALIZED_PL),
                  STTR_UNREALIZED_PL: ((data.STTR_UNREALIZED_PL == null) ? 0 : data.STTR_UNREALIZED_PL),
                  CUMULATIVE: ((data.STTR_REALIZED_PL == null) ? 0 : data.STTR_REALIZED_PL) + ((data.STTR_UNREALIZED_PL == null) ? 0 : data.STTR_UNREALIZED_PL),
                  WINNER: ((parseInt(data.STTR_REALIZED_PL) >= 0) ? 1 : 0),
                  LOSER: ((parseInt(data.STTR_REALIZED_PL) < 0) ? 1 : 0),
                  COMPLETED_TRADES: ((data.STTR_STATE == "CLOSED") ? 1 : 0),
                  INPROGRESS_TRADES: ((data.STTR_STATE == "OPEN") ? 1 : 0)
                }

                this.summary.push(model_row);
              }
              summary_row.STTR_REALIZED_PL = summary_row.STTR_REALIZED_PL + ((data.STTR_REALIZED_PL == null) ? 0 : data.STTR_REALIZED_PL);
              summary_row.STTR_UNREALIZED_PL = summary_row.STTR_UNREALIZED_PL + ((data.STTR_UNREALIZED_PL == null) ? 0 : data.STTR_UNREALIZED_PL);
              summary_row.CUMULATIVE = summary_row.CUMULATIVE + ((data.STTR_REALIZED_PL == null) ? 0 : data.STTR_REALIZED_PL) + ((data.STTR_UNREALIZED_PL == null) ? 0 : data.STTR_UNREALIZED_PL);
              summary_row.WINNER = summary_row.WINNER + ((parseInt(data.STTR_REALIZED_PL) >= 0) ? 1 : 0);
              summary_row.LOSER = summary_row.LOSER + ((parseInt(data.STTR_REALIZED_PL) < 0) ? 1 : 0);
              summary_row.COMPLETED_TRADES = summary_row.COMPLETED_TRADES + ((data.STTR_STATE == "CLOSED") ? 1 : 0);
              summary_row.INPROGRESS_TRADES = summary_row.INPROGRESS_TRADES + ((data.STTR_STATE == "OPEN") ? 1 : 0);

              // if (data.BUY_SELL_FLAG == 'BUY' && data.INCLUDE_FOR_SUM == 1) {
              //   this.buy_pl = this.buy_pl + data.STTR_REALIZED_PL;
              //   this.buy_cnt++;
              // }
              // else if (data.BUY_SELL_FLAG == 'SELL' && data.INCLUDE_FOR_SUM == 1) {
              //   this.sell_pl = this.sell_pl + data.STTR_REALIZED_PL;
              //   this.sell_cnt++;
              // }

              //              }
            }
            this.summary.push(summary_row);
            this.ordersource.load(response.data);
            this.orderSummarySource.load(this.summary);
            this.loading = false;
          }
        });

  }
}