import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SecurityComponent } from './security.component';
import { RolesComponent } from './roles/roles.component';
import { ModulesComponent } from './modules/modules.component';
import { UsersComponent } from './users/users.component';
import { MaintainroleComponent } from './roles/maintainrole/maintainrole.component';
import { MaintainUserComponent } from './users/maintainuser/maintainuser.component';



const routes: Routes = [{
  path: '',
  component: SecurityComponent,
  children: [{
    path: 'roles',
    component: RolesComponent,
  },
  {
    path: 'modules',
    component: ModulesComponent,
  }, {
    path: 'users',
    component: UsersComponent,
  },
  {
    path: 'maintainrole',
    component: MaintainroleComponent,
  },
  {
    path: 'maintainuser',
    component: MaintainUserComponent,
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
export class SecurityRoutingModule {

}

export const routedComponents = [
  

];
