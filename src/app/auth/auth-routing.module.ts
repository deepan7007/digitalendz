import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NbAuthComponent, NbLogoutComponent } from '@nebular/auth';
import { LoginComponent } from './login/login.component';


export const routes: Routes = [
    {
        path: '',
        component: NbAuthComponent,
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
            }
        ],
    },
];
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AuthRoutingModule {
}