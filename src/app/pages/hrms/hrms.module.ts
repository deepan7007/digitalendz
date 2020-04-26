import { NgModule } from '@angular/core';

import { ThemeModule } from '../../@theme/theme.module';
import { HrmsRoutingModule, routedComponents } from './hrms-routing.module';
import { OnboardService } from './onboard/onboard.service';
import { PersonalDetailsComponent } from './personal-details/personal-details.component';
import { AddressDetailsComponent } from './address-details/address-details.component';
import { EducationDetailsComponent } from './education-details/education-details.component';
import { EmploymentHistoryComponent } from './employment-history/employment-history.component';
import {AttachmentDetailsComponent} from './attachment-details/attachment-details.component';
import { SearchEmployeeComponent } from './search-employee/search-employee.component';
import { OnboardComponent } from './onboard/onboard.component';
import { AppCommonModule } from '../../common/app-common.module';
import { ApplyComponent } from './leave/apply/apply.component';
import { LeaveDashboardComponent } from './leave/leavedashboard/leave-dashboard.component';
import { EmployeesearchComponent } from './employeesearch/employeesearch.component';


@NgModule({

  imports: [
    ThemeModule,
    AppCommonModule,
    HrmsRoutingModule,
    
  ],
  declarations: [
    ...routedComponents,
    PersonalDetailsComponent,
    AddressDetailsComponent,
    EducationDetailsComponent,
    EmploymentHistoryComponent,
    SearchEmployeeComponent,
    OnboardComponent,
    AttachmentDetailsComponent,
    ApplyComponent,
    LeaveDashboardComponent,
    EmployeesearchComponent,
    
  ],
  entryComponents: [EmployeesearchComponent],
  providers: [
    OnboardService,  ]
})
export class HrmsModule { }
 