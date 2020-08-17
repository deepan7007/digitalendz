import { Component,  Input, ChangeDetectionStrategy } from '@angular/core';
import { CheckBoxItem } from './check-box-item';
import { MakeProvider, AbstractValueAccessor } from '../abstract-value-accessor';


@Component({
  selector: 'dt-checkbox',
  templateUrl: './dt-checkbox.component.html',
  styleUrls: ['./dt-checkbox.component.scss'],
  providers: [
    MakeProvider(DtCheckboxComponent)
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class DtCheckboxComponent  extends AbstractValueAccessor  {
  @Input() checkboxList: CheckBoxItem;

  constructor() {
    super();
  }
  
  onSelect (item: CheckBoxItem) {
    this.writeValue(this.checkboxList);
  }

}
