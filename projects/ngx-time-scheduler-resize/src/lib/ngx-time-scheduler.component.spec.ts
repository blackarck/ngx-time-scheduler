import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { NgxTimeSchedulerResizeComponent } from './ngx-time-scheduler-resize.component';

describe('NgxTimeSchedulerComponent', () => {
  let component: NgxTimeSchedulerResizeComponent;
  let fixture: ComponentFixture<NgxTimeSchedulerResizeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ NgxTimeSchedulerResizeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NgxTimeSchedulerResizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
