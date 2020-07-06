import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NgbDateStruct, NgbDate, NgbCalendar } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'date-picker',
  templateUrl: './date-picker.component.html',
  styleUrls: ['./date-picker.component.scss'],
})
export class DatePickerComponent implements OnInit {
  model: NgbDateStruct;
  placement = 'bottom';
  datePickerForm: FormGroup;
  selectedDate: string;

  @Input()
  currentDate: NgbDateStruct;
  @Input()
  lableText: string;

  @Output()
  update = new EventEmitter<string>();

  constructor() {

  }

  ngOnInit() {
    if (null != this.currentDate) {
      this.perSelectedDate(this.currentDate);
    }
  }

  onDateSelect(event) {
    this.selectedDate = event.month + '/' + event.day + '/' + event.year;
    this.update.emit(this.selectedDate);
  }
  perSelectedDate(date: NgbDateStruct) {
    this.datePickerForm.patchValue(date);
  }

}
