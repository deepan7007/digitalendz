import { Component, OnInit } from '@angular/core';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartableLinkcolumnComponent } from '../../../common/smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import * as moment from 'moment';

@Component({
  selector: 'opportunity',
  templateUrl: './opportunity.component.html',
  styleUrls: ['./opportunity.component.scss']
})
export class OpportunityComponent implements OnInit {

  private destroy$ = new Subject();
  loading: boolean;
  opportunitySource: LocalDataSource = new LocalDataSource();
  message: string = '';

  constructor(private service: HttpClientService, ) { }

  ngOnInit() {
    this.getOpportunity();
  }

  getOpportunity() {
    let promise = new Promise((resolve, reject) => {
    this.service.getData(environment.getOpportunities)
    .takeUntil(this.destroy$)
      .subscribe(
        (opportunity: Res) => {
          if (opportunity.return_code == 0) {
            this.opportunitySource.load(opportunity.data);
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
      PMOP_ID: {
        title: 'ID',
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
      PMOP_NAME: {
        title: 'Opportunity Name',
      },
      PMOP_OWNER: {
        title: 'Owner',
      },
      PMOP_REVENUE: {
        title: 'Revenue',
      },
      PMOP_REVENUE_TYPE: {
        title: 'Revenue Type',
      },
      PMOP_STATUS: {
        title: 'Status',
      },
      PMOP_EXPECTED_START_DATE: {
        title: 'Start Date',
        valuePrepareFunction: (value) => {
          if (!value) return '';
          return moment(value).format('YYYY-MM-DD');
        },
      },
      PMOP_EXPECTED_END_DATE: {
        title: 'End Date',
        valuePrepareFunction: (value) => {
          if (!value) return '';
          return moment(value).format('YYYY-MM-DD');
        },
      },
      // PMOP_PROSPECT_FOR_NEXT: {
      //   title: 'Prospect',
      // },
      // PMOP_REFERRAL_OUTSIDE_SOURCE: {
      //   title: 'Referral',
      // },
      // PMOP_REFERRAL_NAME:{
      //   title: 'Referral Name',
      // },
      PMOP_CUSTOMER_NAME: {
        title: 'Customer',
      },
      PMOP_CUSTOMER_PHONE: {
        title: 'Contact',
      },
    },
  };

}
