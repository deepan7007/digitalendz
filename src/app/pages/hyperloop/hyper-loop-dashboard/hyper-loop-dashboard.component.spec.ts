import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperLoopDashboardComponent } from './hyper-loop-dashboard.component';

describe('HyperLoopDashboardComponent', () => {
  let component: HyperLoopDashboardComponent;
  let fixture: ComponentFixture<HyperLoopDashboardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperLoopDashboardComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperLoopDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
