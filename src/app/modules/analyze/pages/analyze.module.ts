import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyzeRoutingModule } from './analyze-routing.module';
import { AnalyzeComponent } from './analyze.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';

import { AnalyzeService } from '../services/analyze.service';


@NgModule({
  declarations: [
    AnalyzeComponent
  ],
  imports: [
    CommonModule,
    FileUploadModule,
    ToastModule,
    ProgressSpinnerModule,
    TabMenuModule,
    AnalyzeRoutingModule
  ],
  providers: [
    AnalyzeService
  ]
})
export class AnalyzeModule { }
