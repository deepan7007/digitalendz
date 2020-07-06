import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DtRadioButtonComponent } from './dt-radio-button.component';

describe('DtRadioButtonComponent', () => {
  let component: DtRadioButtonComponent;
  let fixture: ComponentFixture<DtRadioButtonComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DtRadioButtonComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DtRadioButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
