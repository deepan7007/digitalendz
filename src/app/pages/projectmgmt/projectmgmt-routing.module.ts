import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { CreateOpportunityComponent } from './create-opportunity/create-opportunity.component';
import { CreateProjectComponent } from './create-project/create-project.component';
import { ProjectComponent } from './projectmgmt.component';
import { ProjectDetailsComponent } from './project-details/project-details.component';
import { ExpensesComponent } from './expenses/expenses.component';

const routes: Routes = [{
  path: '',
  component: ProjectComponent,
  children: [{
    path: 'opportunity',
    component: OpportunityComponent,
  },
  {
    path: 'createOpportunity',
    component: CreateOpportunityComponent,
  },
  {
    path: 'createProject',
    component: CreateProjectComponent,
  },
  {
    path: 'ProjectDetails',
    component: ProjectDetailsComponent,
  },
  {
    path: 'Expenses',
    component: ExpensesComponent,
  },
  ]
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})

export class ProjectmgmtRoutingModule { }
export const routedComponents = [
  ProjectComponent,

];

