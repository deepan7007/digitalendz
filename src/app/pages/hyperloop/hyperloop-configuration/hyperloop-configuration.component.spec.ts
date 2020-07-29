import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HyperloopConfigurationComponent } from './hyperloop-configuration.component';

describe('HyperloopConfigurationComponent', () => {
  let component: HyperloopConfigurationComponent;
  let fixture: ComponentFixture<HyperloopConfigurationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HyperloopConfigurationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HyperloopConfigurationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
