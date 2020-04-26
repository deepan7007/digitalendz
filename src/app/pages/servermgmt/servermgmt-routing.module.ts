import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ServermgmtComponent } from './servermgmt.component';
import { ServerComponent } from './server/server.component';
import { AppMappingComponent } from './app-mapping/app-mapping.component';
import { ResUtilComponent } from './res-util/res-util.component';
import { SoftwaresComponent } from './softwares/softwares.component';
import { LifecycleComponent } from './lifecycle/lifecycle.component';

const routes: Routes = [{
    path: '',
    component: ServermgmtComponent,
    children: [{ 
        path: 'server',
        component: ServerComponent,
    }, {
        path: 'appmap',
        component: AppMappingComponent,
    }, {
        path: 'resutil',
        component: ResUtilComponent,
    }, {
        path: 'softwares',
        component: SoftwaresComponent,
    }, {
        path: 'lifecyle',
        component: LifecycleComponent,
    }],
}];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class ServermgmtRoutingModule { }
