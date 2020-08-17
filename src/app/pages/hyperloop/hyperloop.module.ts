import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HyperloopRoutingModule } from './hyperloop-routing.module';
import { HyperloopConfigurationComponent } from './hyperloop-configuration/hyperloop-configuration.component';
import { HyperloopComponent } from './hyperloop.component';

import { ThemeModule } from '../../@theme/theme.module';
import { AppCommonModule } from '../../common/app-common.module';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { HyperLoopDashboardComponent } from './hyper-loop-dashboard/hyper-loop-dashboard.component';
import { AccountModelComponent } from './account-model/account-model.component';
import { CronSchdlComponent } from './cron-schdl/cron-schdl.component';
import { NbToastrModule, NbIconModule, NbDialogModule, NbCardModule, NbTabsetComponent, NbTabsetModule, NbDatepickerModule, NbButtonModule, NbSpinnerModule } from '@nebular/theme';
import { NgbDatepicker, NgbDatepickerModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [HyperloopComponent, HyperLoopDashboardComponent, HyperloopConfigurationComponent, AccountModelComponent, CronSchdlComponent],
  imports: [
    CommonModule,
    HyperloopRoutingModule,
    ThemeModule,
    AppCommonModule,
    Ng2SmartTableModule,
    NbToastrModule,
    NbSpinnerModule,
    NgbDatepickerModule
  ]
})
export class HyperloopModule { }
