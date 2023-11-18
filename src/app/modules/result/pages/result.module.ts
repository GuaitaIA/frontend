import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResultRoutingModule } from './result-routing.module';
import { ResultComponent } from './result.component';

import { ReactiveFormsModule } from '@angular/forms';

import { ListboxModule } from 'primeng/listbox';
import { ImageModule } from 'primeng/image';
import { CardModule } from 'primeng/card';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ButtonModule } from 'primeng/button';
import { MenubarModule } from 'primeng/menubar';

import { ResultService } from '../services/result.service';


@NgModule({
  declarations: [
    ResultComponent
  ],
  imports: [
    CommonModule,
    ListboxModule,
    ReactiveFormsModule,
    ImageModule,
    CardModule,
    ToggleButtonModule,
    ButtonModule,
    MenubarModule,
    ResultRoutingModule
  ],
  providers: [
    ResultService
  ]
})
export class ResultModule { }
