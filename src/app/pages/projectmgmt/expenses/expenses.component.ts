import { Component, OnInit, Input } from '@angular/core';
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

@Component({
  selector: 'expenses',
  templateUrl: './expenses.component.html',
  styleUrls: ['./expenses.component.scss']
})
export class ExpensesComponent implements OnInit {


  @Input()
  pjtId: string;

  projectFormGroup: FormGroup;
  private destroy$ = new Subject();
  loading: boolean;
  expensesSource: LocalDataSource = new LocalDataSource();
  message: string = '';
  showExpenses: boolean = true;
  expenseType = [
    { value: 'RESOURCE_SALARY', title: 'Resource Salary' },
    { value: 'INFRA_COST', title: 'Infra Cost' },
    { value: 'Software', title: 'Software' },
    { value: 'Hardware', title: 'Hardware' },
    { value: 'REFERRAL_COST', title: 'Referral Cost' },
    { value: 'AUDITING', title: 'Auditing' },
    { value: 'TDS', title: 'TDS' },
    { value: 'TAX', title: 'TAX' },
  ];

  projectData: NG2SmartList[] = [];

  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private route: ActivatedRoute,) { }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const PMPRJ_ID = params['PMPRJ_ID'];
  
      this.getProject(); 
      this.loadExpensesData();
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
              if(opportunity.data.length==0)
              {
                this.showExpenses= false;
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
      confirmSave:true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    hideSubHeader: false,
    columns: {
      PMEXP_ID: {
        title: 'Expense Id',
      },
      PMPRJ_ID: {
        title: 'Project Id',
        valuePrepareFunction: (value) => {
          return value
        },
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
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: this.expenseType,
          },
        },
      },
      PMEXP_AMOUNT: {
        title: 'Expense Amount',
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
    } else {
      event.confirm.reject();
    }
  }

  loadExpensesData()
  {
    if(!this.commonfunctions.isUndefined(this.pjtId) && this.pjtId != "")
      {
        this.getProjectExpenses(this.pjtId);
      }
      else{
        this.getExpenses();
      }
  }


  deleteExpense(PMEXP_ID)
  {
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
