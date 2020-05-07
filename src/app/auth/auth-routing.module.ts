import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthComponent } from './auth.component';
import { NbLogoutComponent } from '@nebular/auth';


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
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}