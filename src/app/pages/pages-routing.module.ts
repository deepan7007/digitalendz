import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from '../common/http/services/auth-guard.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  canActivate: [AuthGuard],
  children: [
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
    {
      path: '',
      redirectTo: 'dashboard',
      pathMatch: 'full',
    },
    {
      path: 'servermgmt',
      loadChildren: () => import('./servermgmt/servermgmt.module')
        .then(m => m.ServermgmtModule),
    },
    {
      path: 'security',
      loadChildren: () => import('./security/security.module')
        .then(m => m.SecurityModule),
    },
    {
      path: 'hrms',
      loadChildren: () => import('./hrms/hrms.module')
        .then(m => m.HrmsModule),
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
