import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { ActivatedRoute } from '@angular/router';
import { Cell, DefaultEditor, Editor, ViewCell, LocalDataSource } from 'ng2-smart-table';
import { NG2SmartList } from './../../../shared/ng2-smart-list'
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { NbToastrService } from '@nebular/theme';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  @Input()
  pjtId: string;

  @Output() 
  updateInvoiceChange = new EventEmitter<boolean>();

  projectFormGroup: FormGroup;
  private destroy$ = new Subject();
  loading: boolean;
  invoicesSource: LocalDataSource = new LocalDataSource();
  message: string = '';
  
  projectData: NG2SmartList[] = [];
  invoiceTypeData: NG2SmartList[] = [];
  paymentModeData: NG2SmartList[] = [];
  invoiceStatusData: NG2SmartList[] = [];

  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,
    ) { }

  ngOnInit() {

    this.route.queryParams.subscribe(params => {
      const PMPRJ_ID = params['PMPRJ_ID'];
      this.getMetaData();
      this.getPaymentModeMetaData();
      this.getProject();
      this.loadInvoicesData();
    });

  }

  getProject() {
    let promise = new Promise((resolve, reject) => {
      this.service.getData(environment.getProjects)
        .takeUntil(this.destroy$)
        .subscribe(
          (project: Res) => {
            if (project.return_code == 0) {
              project.data.forEach(element => {
                this.projectData.push({ value: element.PMPRJ_ID, title: element.PMPRJ_NAME });
              });
              this.settings['columns'].PMPRJ_ID.editor.config.list = this.projectData;
              this.settings = Object.assign({}, this.settings);
            }
            else {
              this.message = project.return_message;
            }
          },
          (err) => {
            console.log('Something went wrong! ' + err.error);
          });

      resolve();
    });
    return promise;
  }

  getInvoices() {
    let promise = new Promise((resolve, reject) => {
      this.service.getData(environment.getInvoices)
        .takeUntil(this.destroy$)
        .subscribe(
          (opportunity: Res) => {
            if (opportunity.return_code == 0) {
              this.invoicesSource.load(opportunity.data);
            }
            else {
              this.message = opportunity.return_message;
            }
          },
          (err) => {
            console.log('Something went wrong! ' + err.error);
          });
      resolve();
    });
    return promise;
  }

  getProjectInvoices(projectId) {
    this.projectFormGroup = this.formBuilder.group({
      PMPRJ_ID: [this.pjtId,],
    });

    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.searchInvoicesByProject, this.projectFormGroup.value)
        .takeUntil(this.destroy$)
        .subscribe(
          (opportunity: Res) => {
            if (opportunity.return_code == 0) {
              this.invoicesSource.load(opportunity.data);
              if (opportunity.data.length == 0)
                if (!this.commonfunctions.isUndefined(opportunity.data.length) && opportunity.data.length != 0) {
                  // this.showInvoices = true;
                }
            }
            else {
              this.message = opportunity.return_message;
            }
          },
          (err) => {
            console.log('Something went wrong! ' + err.error);
          });
      resolve();
    });
    return promise;
  }

  getMetaData() {
    let promise = new Promise((resolve, reject) => {
      var filters = [{
        name: "module",
        value: "PROJECTMGMT"
      },
      {
        name: "submodule",
        value: "INVOICE"
      },
      ];

      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getDropdownMetaData(metadata, 'PROJECTMGMT', 'INVOICE', 'INVOICE_TYPE').then(
              (metadata: any) => { 
                metadata.availableOptions.forEach(element => {
                  this.invoiceTypeData.push({ value: element.value, title: element.title });
                });
                this.settings['columns'].PMINV_TYPE.editor.config.list = this.invoiceTypeData;
                this.settings = Object.assign({}, this.settings);

              }
            );
            this.commonfunctions.getDropdownMetaData(metadata, 'PROJECTMGMT', 'INVOICE', 'INVOICE_STATUS').then(
              (metadata: any) => { 
                metadata.availableOptions.forEach(element => {
                  this.invoiceStatusData.push({ value: element.value, title: element.title });
                });
                this.settings['columns'].PMINV_STATUS.editor.config.list = this.invoiceStatusData;
                this.settings = Object.assign({}, this.settings);

              }
            );
            resolve();
          }
        );
    });
    return promise;
  }

  getPaymentModeMetaData() {
    let promise = new Promise((resolve, reject) => {
      var filters = [{
        name: "module",
        value: "PROJECTMGMT"
      },
      {
        name: "submodule",
        value: "EXPENSES"
      },
      ];

      this.service.getDatawithFilters(environment.getMetaData, filters)
        .subscribe(
          (metaData: Res) => {
            var string = JSON.stringify(metaData.data);
            var metadata = JSON.parse(string);
            this.commonfunctions.getDropdownMetaData(metadata, 'PROJECTMGMT', 'EXPENSES', 'PAYMENT_MODE').then(
              (metadata: any) => {
                metadata.availableOptions.forEach(element => {
                  this.paymentModeData.push({ value: element.value, title: element.title });
                });
                this.settings['columns'].PMINV_PAYMENT_MODE.editor.config.list = this.paymentModeData;
                this.settings = Object.assign({}, this.settings);
              }
            );
            resolve();
          }
        );
    });
    return promise;
  }

  onCreateInvoices(event) {
    event.newData.PMINV_ID = null;
    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.saveInvoice, event.newData).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'success', "Invoice created succesfully", res.return_message);
            event.confirm.resolve();
            this.loadInvoicesData();
            this.updateInvoiceChange.emit(true);
          }
        });
      resolve();
    });
    return promise;
  }

  onEditInvoices(event) {
    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.saveInvoice, event.newData).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'success', "Invoice saved succesfully", res.return_message);
            event.confirm.resolve();
            this.loadInvoicesData();
            this.updateInvoiceChange.emit(true);
          }
        });
      resolve();
    });
    return promise;
  }

  onDeleteInvoices(event): void {
    if (window.confirm('Delete Invoice')) {
      this.deleteInvoice(event.data.PMINV_ID);
      event.confirm.resolve();
      this.updateInvoiceChange.emit(true);
    } else {
      event.confirm.reject();
    }
  }

  deleteInvoice(PMINV_ID) {
    let promise = new Promise((resolve, reject) => {

      var formData = {
        PMINV_ID: PMINV_ID,
      };
      this.service.postData(environment.deleteInvoice, formData).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'success', "Invoice Deleted succesfully", res.return_message);
            this.loadInvoicesData();
          }
        });
      resolve();
    });
    return promise;
  }

  loadInvoicesData() {
    if (!this.commonfunctions.isUndefined(this.pjtId) && this.pjtId != "") {
      this.getProjectInvoices(this.pjtId);
    }
    else {
      this.getInvoices();
    }
  }

  settings = {
    actions: {
      position: 'right'
    },
    pager: {
      display: true,
      perPage: 20,
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
      confirmDelete: true,
    },
    hideSubHeader: false,
    columns: {
      PMINV_ID: {
        title: 'Id',
      },
      PMPRJ_ID: {
        title: 'Prj',
        valuePrepareFunction: (value) => { return value },
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.projectData,
          },
        },
      },
      PMINV_STATUS: {
        title: 'Status',
        valuePrepareFunction: (value) => { return value },
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.invoiceStatusData,
          },
        },
      },
      PMINV_TYPE: {
        title: 'Type',
        valuePrepareFunction: (value) => { return value },
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.invoiceTypeData,
          },
        },
      },
      PMINV_DESCRIPTION: {
        title: 'Description',
      },
    
      PMINV_AMOUNT: {
        title: 'Amount',
      },
      PMINV_PAYMENT_MODE: {
        title: 'Mode',
        valuePrepareFunction: (value) => { return value },
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.paymentModeData,
          },
        },
      },
      PMINV_TRANSACTION_IDENTIFIER: {
        title: 'Identifier',
      },
      PMINV_PAID_BY: {
        title: 'Paid By',
      },
      PMINV_TRANSACTION_DATE: {
        title: 'Date',
        width: '10px',
        placeholder: 'yyyy/mm/dd',
        valuePrepareFunction: (transactionDate: any) => {
          console.log(transactionDate);
          return new DatePipe('en-US').transform(transactionDate, 'y/M/d')
        }
        
      },

    },
  };

}
