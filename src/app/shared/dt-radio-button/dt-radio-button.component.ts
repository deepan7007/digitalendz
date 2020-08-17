import { Component, OnInit, Input, ChangeDetectionStrategy, Output, EventEmitter, forwardRef } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { RadioButtonItem } from './radio-button-item';
import { MakeProvider, AbstractValueAccessor } from '../abstract-value-accessor';
import { CompileShallowModuleMetadata } from '@angular/compiler';

@Component({
  selector: 'dt-radio-button',
  templateUrl: './dt-radio-button.component.html',
  styleUrls: ['./dt-radio-button.component.scss'],
  providers: [
    MakeProvider(DtRadioButtonComponent)
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DtRadioButtonComponent extends AbstractValueAccessor {
  @Input() radioOptions: Array<RadioButtonItem>;

  constructor() {
    super();
  }

  onSelect (item: RadioButtonItem) {
    this.writeValue(item);
  }

}
