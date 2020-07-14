import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OpportunityComponent } from './opportunity/opportunity.component';
import { CreateOpportunityComponent } from './create-opportunity/create-opportunity.component';
import { ProjectComponent } from './projectmgmt.component';

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

