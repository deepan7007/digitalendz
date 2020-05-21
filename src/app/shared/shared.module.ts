import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePickerComponent } from './date-picker/date-picker.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { NgxMyDatePickerModule } from 'ngx-mydatepicker';
import { DropdownComponent } from './dropdown/dropdown.component';

@NgModule({
  declarations: [DatePickerComponent, DropdownComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    NgxMyDatePickerModule.forRoot() 
    
  ],
  entryComponents: [],
  exports: [DatePickerComponent, DropdownComponent],
})
export class SharedModule { }
