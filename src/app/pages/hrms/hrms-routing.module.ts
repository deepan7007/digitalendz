import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HrmsComponent } from './hrms.component';
import { OnboardComponent } from './onboard/onboard.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { ApplyComponent } from './leave/apply/apply.component';
import { LeaveDashboardComponent } from './leave/leavedashboard/leave-dashboard.component'


const routes: Routes = [{
  path: '',
  component: HrmsComponent,
  children: [{
    path: 'onboard',
    component: SearchEmployeeComponent,
  },
  {
    path: 'maintainEmployee',
    component: OnboardComponent,
  },
  {
    path: 'leave/apply',
    component: ApplyComponent,
  },
  {
    path: 'leave/leavedashboard',
    component: LeaveDashboardComponent,
  },
  ],
}];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
  ],
  exports: [
    RouterModule,
  ],
})
export class HrmsRoutingModule {

}

export const routedComponents = [
  HrmsComponent,
  SearchEmployeeComponent,

];
