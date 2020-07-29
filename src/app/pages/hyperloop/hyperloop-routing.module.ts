import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HyperloopComponent } from './hyperloop.component';
import { HyperloopConfigurationComponent } from './hyperloop-configuration/hyperloop-configuration.component';
import { HyperLoopDashboardComponent } from './hyper-loop-dashboard/hyper-loop-dashboard.component';
import { AccountModelComponent } from './account-model/account-model.component';
import { CronSchdlComponent } from './cron-schdl/cron-schdl.component';


const routes: Routes = [{
  path: '',
  component: HyperloopComponent,
  children: [{
    path: 'hyperloopdashboard',
    component: HyperLoopDashboardComponent,
  },
  {
    path: 'hyperloop-configuration',
    component: HyperloopConfigurationComponent
  },
  {
    path: 'hyperloop-accounts',
    component: AccountModelComponent
  },
  {
    path: 'cron-scheduler',
    component: CronSchdlComponent
  },
  ],
}];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HyperloopRoutingModule { }
