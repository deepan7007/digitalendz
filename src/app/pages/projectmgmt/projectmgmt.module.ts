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
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ExpensesComponent } from './expenses/expenses.component';
import { ProjectAttachmentComponent } from './project-attachment/project-attachment.component';

@NgModule({
  declarations: [
    ProjectComponent,
    OpportunityComponent, 
    CreateOpportunityComponent, 
    CreateProjectComponent, ProjectDetailsComponent, ExpensesComponent, ProjectAttachmentComponent, 
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
