import { NgModule } from '@angular/core';
import { NgxTimeSchedulerResizeComponent } from './ngx-time-scheduler-resize.component';
import {CommonModule} from '@angular/common';
import {DragDropModule} from '@angular/cdk/drag-drop';
import { ResizableModule } from 'angular-resizable-element';

@NgModule({
  declarations: [NgxTimeSchedulerResizeComponent],
  imports: [
    CommonModule,
    DragDropModule,
    ResizableModule,
  ],
  exports: [NgxTimeSchedulerResizeComponent]
})
export class NgxTimeSchedulerResizeModule { }
