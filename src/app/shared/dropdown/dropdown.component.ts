
import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';

import { Dropdown, DropdownItem } from './dropdown-item';
import { MakeProvider, AbstractValueAccessor } from '../abstract-value-accessor';


@Component({
  selector: 'dropdown',
  templateUrl: './dropdown.component.html',
  styleUrls: ['./dropdown.component.scss'],
  providers: [
    MakeProvider(DropdownComponent)
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DropdownComponent extends AbstractValueAccessor {
  @Input() config: Dropdown;

  constructor() {
    super();
  }

  onSelect (item: DropdownItem) {
    this.writeValue(item);
  }
}
