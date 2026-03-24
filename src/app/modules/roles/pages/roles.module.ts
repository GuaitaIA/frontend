import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { RolesComponent } from './roles.component';
import { RolesRoutingModule } from './roles-routing.module';

@NgModule({
    declarations: [
        RolesComponent
    ],
    imports: [
        CommonModule,
        TableModule,
        ButtonModule,
        DialogModule,
        InputTextModule,
        SelectModule,
        TagModule,
        ToastModule,
        ReactiveFormsModule,
        FormsModule,
        RolesRoutingModule
    ]
})
export class RolesModule { }
