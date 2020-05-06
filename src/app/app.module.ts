/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,

} from '@nebular/theme';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { NbAuthModule, NbPasswordAuthStrategy, NbAuthJWTToken, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { AuthGuard } from './common/http/services/auth-guard.service';
import { AuthInterceptor } from './common/http/services/auth.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,

    ThemeModule.forRoot(),

    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    NbEvaIconsModule,
    NbAuthModule.forRoot({
      strategies: [
        NbPasswordAuthStrategy.setup({
          name: 'email',
          token: {
            class: NbAuthJWTToken,
            // key: 'token',
          },
          baseEndpoint: '',
          login: {
            endpoint: '/api/auth/login',
            redirect: {
              success: '/pages/dashboard',
              failure: null, // stay on the same page
            },
          },
          logout: {
            endpoint: '/api/auth/logout',
            redirect: {
              success: '/auth/login',
              failure: '/auth/login', // stay on the same page
            },
          },
        }),
      ],
      forms: {},
    }),
  ],
  providers: [
    {
      provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
      useValue: function (req: HttpRequest<any>) {
        if (req.url === '/api/auth/refresh-token' || req.url === '/api/auth/login' || req.url === '/api/auth/forgot-password') {
          return true;
        }
        return false;
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    AuthGuard
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
