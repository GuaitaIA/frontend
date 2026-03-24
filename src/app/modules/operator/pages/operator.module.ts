import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { ImageModule } from 'primeng/image';
import { ProgressBarModule } from 'primeng/progressbar';
import { TagModule } from 'primeng/tag';
import { OperatorComponent } from './operator.component';
import { OperatorRoutingModule } from './operator-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        ImageModule,
        ProgressBarModule,
        TagModule,
        OperatorRoutingModule
    ],
    declarations: [OperatorComponent],
})
export class OperatorModule { }
