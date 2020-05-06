import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { AuthRoutingModule } from './auth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbIconModule,
  NbLayoutModule,
  NbCardModule
} from '@nebular/theme';
import { LoginComponent } from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AuthComponent } from './auth.component';



@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    AuthRoutingModule,
    NbAuthModule,
    NbIconModule,
    NbLayoutModule,
    NbCardModule,
  ],
  declarations: [
    LoginComponent,
    LogoutComponent,
    ResetPasswordComponent,
    AuthComponent
    // ... here goes our new components
  ],
})
export class AuthModule {
}