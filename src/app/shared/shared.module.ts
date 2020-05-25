import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DropdownComponent } from './dropdown/dropdown.component';
import { DtRadioButtonComponent } from './dt-radio-button/dt-radio-button.component';
import { DtCheckboxComponent } from './dt-checkbox/dt-checkbox.component';

@NgModule({
  declarations: [DatePickerComponent, DropdownComponent, DtRadioButtonComponent, DtCheckboxComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgxMyDatePickerModule.forRoot(),
    ReactiveFormsModule,
    
  ],
  entryComponents: [],
  exports: [DatePickerComponent, DropdownComponent, DtRadioButtonComponent, DtCheckboxComponent],
})
export class SharedModule { }
