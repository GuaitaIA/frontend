import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AnalyzeRoutingModule } from './analyze-routing.module';
import { AnalyzeComponent } from './analyze.component';
import { AnalyzeService } from '../services/analyze.service';
import { ButtonModule } from 'primeng/button';
import { FileUploadModule } from 'primeng/fileupload';
import { ImageModule } from 'primeng/image';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AnalyzeComponent
  ],
  imports: [
    CommonModule,
    ButtonModule,
    FileUploadModule,
    FormsModule,
    ImageModule,
    InputNumberModule,
    ProgressSpinnerModule,
    ReactiveFormsModule,
    SelectModule,
    TabsModule,
    TextareaModule,
    ToastModule,
    AnalyzeRoutingModule
  ],
  providers: [
    AnalyzeService
  ]
})
export class AnalyzeModule { }
