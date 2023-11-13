import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AnalyzeComponent } from './analyze.component';

const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: AnalyzeComponent }
  ])],
  exports: [RouterModule]
})
export class AnalyzeRoutingModule { }
