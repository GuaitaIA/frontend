import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { SettingsComponent } from './settings.component';
import { SettingsRoutingModule } from './settings-routing.module';

@NgModule({
    declarations: [
        SettingsComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        ButtonModule,
        CheckboxModule,
        ToastModule,
        SettingsRoutingModule
    ]
})
export class SettingsModule { }
