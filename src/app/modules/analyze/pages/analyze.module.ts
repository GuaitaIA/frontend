import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AnalyzeRoutingModule } from './analyze-routing.module';
import { AnalyzeComponent } from './analyze.component';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TabMenuModule } from 'primeng/tabmenu';
import { InputTextModule } from 'primeng/inputtext';
import { ImageModule } from 'primeng/image';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';

import { AnalyzeService } from '../services/analyze.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


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
    ReactiveFormsModule,
    FormsModule,
    InputTextModule,
    ImageModule,
    InputTextareaModule,
    InputNumberModule,
    DropdownModule,
    AnalyzeRoutingModule
  ],
  providers: [
    AnalyzeService
  ]
})
export class AnalyzeModule { }
