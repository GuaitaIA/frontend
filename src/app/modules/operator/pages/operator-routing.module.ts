import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OperatorComponent } from './operator.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: OperatorComponent }
    ])],
    exports: [RouterModule]
})
export class OperatorRoutingModule { }
