import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultComponent } from './result.component';

import { ReactiveFormsModule } from '@angular/forms';

import { ListboxModule } from 'primeng/listbox';


@NgModule({
  declarations: [
    ResultComponent
  ],
  imports: [
    CommonModule,
    ListboxModule,
    ReactiveFormsModule,
    ResultRoutingModule
  ]
})
export class ResultModule { }
