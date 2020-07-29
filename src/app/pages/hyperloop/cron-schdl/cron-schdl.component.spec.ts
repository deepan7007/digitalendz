import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CronSchdlComponent } from './cron-schdl.component';

describe('CronSchdlComponent', () => {
  let component: CronSchdlComponent;
  let fixture: ComponentFixture<CronSchdlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CronSchdlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CronSchdlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
