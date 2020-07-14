import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { AppCommonModule } from '../../common/app-common.module';
import { ProjectmgmtRoutingModule } from './projectmgmt-routing.module';
import { CreateOpportunityComponent } from './create-opportunity/create-opportunity.component';
import { SharedModule } from '.././../shared/shared.module';
import { ProjectComponent } from './projectmgmt.component';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [
    ProjectComponent,
    OpportunityComponent, 
    CreateOpportunityComponent, 
    ],

  imports: [
    CommonModule,
    AppCommonModule,
    ProjectmgmtRoutingModule,
    SharedModule,
    NgxMyDatePickerModule.forRoot(),
    NgbModule,
  ]
})
export class ProjectmgmtModule { }
