import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { RolesComponent } from './roles/roles.component';
import { UsersComponent } from './users/users.component';
import { ModulesComponent } from './modules/modules.component';
import { MaintainroleComponent } from './roles/maintainrole/maintainrole.component';
import { MaintainUserComponent } from './users/maintainuser/maintainuser.component';
import { UsersModalComponent } from './users/users-modal/users-modal.component';
import { AppCommonModule } from '../../common/app-common.module';
import { RoleGuard } from '../../common/http/services/role-guard.service';

import { SecurityRoutingModule } from './security-routing.module';
import { AuthGuard } from '../../common/http/services/auth-guard.service';
import { SecurityComponent } from './security.component';
import { RolesModalComponent } from './roles/roles-modal/roles-modal.component';
import { NbDialogModule } from '@nebular/theme';



@NgModule({

  imports: [
    ThemeModule,
    AppCommonModule,
    SecurityRoutingModule,
    NbDialogModule.forRoot()
  ],
  declarations: [
    SecurityComponent,
    RolesComponent,
    UsersComponent,
    ModulesComponent,
    MaintainUserComponent,
    UsersModalComponent,
    MaintainroleComponent,
    RolesModalComponent,
  ],
  entryComponents: [ModulesComponent,UsersModalComponent],
  providers: [AuthGuard]
})
export class SecurityModule { }
