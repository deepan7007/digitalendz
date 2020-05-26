import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { NbLogoutComponent, NbRequestPasswordComponent } from '@nebular/auth';
import { ResetPasswordComponent } from './reset-password/reset-password.component';


export const routes: Routes = [
    {
        path: '',
        component: AuthComponent,
        children: [
            {
                path: '',
                component: LoginComponent, // <---
            },
            {
                path: 'login',
                component: LoginComponent, // <---
            },
            {
                path: 'logout',
                component: NbLogoutComponent,
            },
            {
                path: 'reset-password',
                component: ResetPasswordComponent,
              },
              {
                path: 'request-password',
                component: NbRequestPasswordComponent,
              },
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}