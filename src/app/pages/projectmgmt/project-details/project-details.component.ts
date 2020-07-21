import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import * as moment from 'moment';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

  private destroy$ = new Subject();
  loading: boolean;
  projectSource: LocalDataSource = new LocalDataSource();
  message: string = '';

  constructor(private service: HttpClientService, ) { }

  ngOnInit() {
    this.getProject();
  }

  getProject() {
    let promise = new Promise((resolve, reject) => {
      this.service.getData(environment.getProjects)
        .takeUntil(this.destroy$)
        .subscribe(
          (project: Res) => {
            if (project.return_code == 0) {
              this.projectSource.load(project.data);
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
    actions: false,
    delete: {
      confirmDelete: true,

      deleteButtonContent: 'Delete data',
      saveButtonContent: 'save',
      cancelButtonContent: 'cancel'
    },
    add: {
      confirmCreate: true,
    },
    edit: {
      confirmSave: true,
    },
    columns: {
      PMPRJ_ID: {
        title: 'ID',
        type: 'custom',
        filter: true,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/projectmgmt/createProject",
            linkparam: { projectId: row.PMPRJ_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent
      },
      PMOP_ID: {
        title: 'Opportunity Id',
        type: 'custom',
        filter: true,
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            linkname: value,
            link: "/pages/projectmgmt/createOpportunity",
            linkparam: { opportunityId: row.PMOP_ID }
          };
          return linkelement
        },
        renderComponent: SmartableLinkcolumnComponent
      
      },
      PMPRJ_NAME: {
        title: 'Project Name',
      },
      PMPRJ_PM: {
        title: 'Project Manager',
      },
      PMPRJ_REVENUE: {
        title: 'Revenue',
      },
      PMPRJ_COST_SPENT: {
        title: 'Cost Spent',
      },
      PMPRJ_START_DATE: {
        title: 'Start Date',
        valuePrepareFunction: (value) => {
          if (!value) return '';
          return moment(value).format('YYYY-MM-DD');
        },
      },
      PMPRJ_END_DATE: {
        title: 'End Date',
        valuePrepareFunction: (value) => {
          if (!value) return '';
          return moment(value).format('YYYY-MM-DD');
        },
      },
      PMPRJ_CP_PERCENTAGE: {
        title: 'Prrojet CP %',
      },
    },
  };

}
