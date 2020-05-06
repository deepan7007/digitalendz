import { NgModule, Injector } from '@angular/core';
import { HttpClientService } from './http/services/httpclient.service';
import { AuthInterceptor } from './http/services/auth.interceptor';
import { CommonFunctions } from './service/commonfunctions.service';
import { RoleGuard } from './http/services/role-guard.service';
import { SmartableLinkcolumnComponent } from './smartable/component/smartable-linkcolumn/smartable-linkcolumn.component';
import { SmartTable } from './smartable/service/smarttable.servics';
import { HttpClientModule, HTTP_INTERCEPTORS, HttpRequest } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SmartableServicecolumnComponent } from './smartable/component/smartable-servicecolumn/smartable-servicecolumn.component';
import { ThemeModule } from '../@theme/theme.module';
import { ExportTableComponent } from '../common/smartable/component/export-table/export-table.component';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';
import { ButtonViewComponent } from './smartable/component/button-view/button-view.component';
import { NbToastrModule, NbIconModule, NbDialogModule, NbCardModule, NbTabsetComponent, NbTabsetModule, NbDatepickerModule, NbButtonModule } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { AuthGuard } from './http/services/auth-guard.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NbEvaIconsModule } from '@nebular/eva-icons';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
import { AutoLogoutComponent } from './service/auto-logout/auto-logout.component';
@NgModule({
  declarations: [SmartableLinkcolumnComponent,
    SmartableServicecolumnComponent,
    ExportTableComponent,
    ButtonViewComponent,
    AutoLogoutComponent,

  ],
  imports: [
    HttpClientModule,
    RouterModule,
    CommonModule,
    ThemeModule,
    FileUploadModule,
    Ng2GoogleChartsModule,
    NbToastrModule.forRoot(),
    Ng2SmartTableModule,
    NbIconModule,
    NbCardModule,
    NbDialogModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NbEvaIconsModule,
    NbTabsetModule,
    NbButtonModule,
    //Angular Material
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    //Angular Material
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbDatepickerModule.forRoot(),
  ],

  providers: [
    HttpClientService,
    CommonFunctions,
    SmartTable,
    {
      provide: NB_AUTH_TOKEN_INTERCEPTOR_FILTER,
      useValue: function (req: HttpRequest<any>) {
        if (req.url === '/api/auth/refresh-token' || req.url === '/api/auth/login' || req.url === '/api/auth/forgot-password') {
          return true;
        }
        return false;
      },
    },
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    AuthGuard,
    RoleGuard,
  ],
  entryComponents: [SmartableLinkcolumnComponent, SmartableServicecolumnComponent, ButtonViewComponent],
  exports: [
    ExportTableComponent,
    FileUploadModule,
    Ng2GoogleChartsModule,
    NbToastrModule,
    Ng2SmartTableModule,
    NbIconModule,
    NbDialogModule,
    NbCardModule,
    FormsModule,
    ReactiveFormsModule,
    NbEvaIconsModule,
    NbTabsetModule,
    NbButtonModule,
    //Angular Material
    MatNativeDateModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatFormFieldModule,
    MatInputModule,
    //Angular Material
    OwlDateTimeModule,
    OwlNativeDateTimeModule,
    NbDatepickerModule,
  ]
})
export class AppCommonModule {

}