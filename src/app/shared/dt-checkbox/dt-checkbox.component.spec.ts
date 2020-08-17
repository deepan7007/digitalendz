import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtCheckboxComponent } from './dt-checkbox.component';

describe('DtCheckboxComponent', () => {
  let component: DtCheckboxComponent;
  let fixture: ComponentFixture<DtCheckboxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtCheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtCheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
