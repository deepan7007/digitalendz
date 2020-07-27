import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AccountModelComponent } from './account-model.component';

describe('AccountModelComponent', () => {
  let component: AccountModelComponent;
  let fixture: ComponentFixture<AccountModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AccountModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AccountModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
