import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectAttachmentComponent } from './project-attachment.component';

describe('ProjectAttachmentComponent', () => {
  let component: ProjectAttachmentComponent;
  let fixture: ComponentFixture<ProjectAttachmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProjectAttachmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectAttachmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
