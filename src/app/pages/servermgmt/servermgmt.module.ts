import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ServerComponent } from './server/server.component';
import { AppMappingComponent } from './app-mapping/app-mapping.component';
import { ResUtilComponent } from './res-util/res-util.component';
import { SoftwaresComponent } from './softwares/softwares.component';
import { LifecycleComponent } from './lifecycle/lifecycle.component';
import { ServermgmtRoutingModule } from './servermgmt-routing.module';
import { ServermgmtComponent } from './servermgmt.component';
import { AppCommonModule } from '../../common/app-common.module';


@NgModule({
  declarations: [ServermgmtComponent, ServerComponent, AppMappingComponent, ResUtilComponent, SoftwaresComponent, LifecycleComponent],
  imports: [
    CommonModule,
    ServermgmtRoutingModule,
    AppCommonModule,
  ]
})
export class ServermgmtModule { }
