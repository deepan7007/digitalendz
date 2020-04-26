import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResUtilComponent } from './res-util.component';

describe('ResUtilComponent', () => {
  let component: ResUtilComponent;
  let fixture: ComponentFixture<ResUtilComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResUtilComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResUtilComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
