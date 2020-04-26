import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppMappingComponent } from './app-mapping.component';

describe('AppMappingComponent', () => {
  let component: AppMappingComponent;
  let fixture: ComponentFixture<AppMappingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppMappingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppMappingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
