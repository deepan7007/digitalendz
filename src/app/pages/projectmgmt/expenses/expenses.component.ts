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
  selector: 'expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})

export class ExpensesComponent implements OnInit {

  @Input()
  pjtId: string;

  @Output()
  updateRevenueChange = new EventEmitter<boolean>();

  projectFormGroup: FormGroup;
  private destroy$ = new Subject();
  loading: boolean;
  expensesSource: LocalDataSource = new LocalDataSource();
  message: string = '';
  showExpenses: boolean = false;

  projectData: NG2SmartList[] = [];
  expenseTypeData: NG2SmartList[] = [];
  paymentModeData: NG2SmartList[] = [];

  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const PMPRJ_ID = params['PMPRJ_ID'];

      this.getMetaData();
      this.getProject();
      this.loadExpensesData();

      if (!(!this.commonfunctions.isUndefined(PMPRJ_ID) && PMPRJ_ID != "")) {
        this.showExpenses = true;
      }
    });
  }

  getExpenses() {
    let promise = new Promise((resolve, reject) => {
      this.service.getData(environment.getExpenses)
        .takeUntil(this.destroy$)
        .subscribe(
          (opportunity: Res) => {
            if (opportunity.return_code == 0) {
              this.expensesSource.load(opportunity.data);
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

  getProjectExpenses(projectId) {
    this.projectFormGroup = this.formBuilder.group({
      PMPRJ_ID: [this.pjtId,],
    });

    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.searchExpensesByProject, this.projectFormGroup.value)
        .takeUntil(this.destroy$)
        .subscribe(
          (opportunity: Res) => {
            if (opportunity.return_code == 0) {
              this.expensesSource.load(opportunity.data);
              if (opportunity.data.length == 0)
                if (!this.commonfunctions.isUndefined(opportunity.data.length) && opportunity.data.length != 0) {
                  this.showExpenses = true;
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

  getMetaData() {
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
            this.commonfunctions.getDropdownMetaData(metadata, 'PROJECTMGMT', 'EXPENSES', 'EXPENSES_TYPE').then(
              (metadata: any) => {
                metadata.availableOptions.forEach(element => {
                  this.expenseTypeData.push({ value: element.value, title: element.title });
                });
                this.settings['columns'].PMEXP_TYPE.editor.config.list = this.expenseTypeData;
                this.settings = Object.assign({}, this.settings);

              }
            );
            this.commonfunctions.getDropdownMetaData(metadata, 'PROJECTMGMT', 'EXPENSES', 'PAYMENT_MODE').then(
              (metadata: any) => {
                metadata.availableOptions.forEach(element => {
                  this.paymentModeData.push({ value: element.value, title: element.title });
                });
                this.settings['columns'].PMEXP_PAYMENT_MODE.editor.config.list = this.paymentModeData;
                this.settings = Object.assign({}, this.settings);
              }
            );
            resolve();
          }
        );
    });
    return promise;
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
      PMEXP_ID: {
        title: 'Id',
      },
      PMEXP_DESCRIPTION: {
        title: 'Description',
      },
      PMPRJ_ID: {
        title: 'Project Id',
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
      PMEXP_TYPE: {
        title: 'Expense Type',
        valuePrepareFunction: (value) => { return value },
        type: 'string',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.expenseTypeData,
          },
        },
      },
      PMEXP_AMOUNT: {
        title: 'Amount',
      },
      PMEXP_PAYMENT_MODE: {
        title: 'Payment Mode',
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
      PMEXP_TRANSACTION_IDENTIFIER: {
        title: 'Transaction Identifier',
      },
      PMEXP_TRANSACTION_DATE: {
        title: 'Date(yyyy/mm/dd)',
        width: '10px',
        placeholder: 'yyyy/mm/dd',
        valuePrepareFunction: (transactionDate: any) => {
          console.log(transactionDate);
          return new DatePipe('en-US').transform(transactionDate, 'y/M/d')
        }

      },
    },
  };

  onCreateExpenses(event) {
    event.newData.PMEXP_ID = null;
    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.saveExpenses, event.newData).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'success', "Expences created succesfully", res.return_message);
            event.confirm.resolve();
            this.updateRevenueChange.emit(true);
            this.loadExpensesData();

          }
        });
      resolve();
    });
    return promise;
  }

  onEditExpenses(event) {
    let promise = new Promise((resolve, reject) => {
      this.service.postData(environment.saveExpenses, event.newData).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'success', "Expences saved succesfully", res.return_message);
            event.confirm.resolve();
            this.updateRevenueChange.emit(true);
            this.loadExpensesData();
          }
        });
      resolve();
    });
    return promise;
  }

  onDeleteExpenses(event): void {
    if (window.confirm('Delete Expense')) {
      this.deleteExpense(event.data.PMEXP_ID);
      event.confirm.resolve();
      this.updateRevenueChange.emit(true);
    } else {
      event.confirm.reject();
    }
  }

  loadExpensesData() {
    if (!this.commonfunctions.isUndefined(this.pjtId) && this.pjtId != "") {
      this.getProjectExpenses(this.pjtId);
    }
    else {
      this.getExpenses();
    }
  }

  deleteExpense(PMEXP_ID) {
    let promise = new Promise((resolve, reject) => {

      var formData = {
        PMEXP_ID: PMEXP_ID,
      };
      this.service.postData(environment.deleteExpemse, formData).takeUntil(this.destroy$).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {
            this.commonfunctions.showToast(this.toasterService, "error", "Error", res.return_message);
          }
          else {
            this.commonfunctions.showToast(this.toasterService, 'success', "Expences Deleted succesfully", res.return_message);
            this.loadExpensesData();
          }
        });
      resolve();
    });
    return promise;
  }

}