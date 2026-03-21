import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FormLayoutDemoComponent } from './formlayoutdemo.component';
import { FormLayoutDemoRoutingModule } from './formlayoutdemo-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { DatePickerModule } from "primeng/datepicker";
import { ChipsModule } from "primeng/chips";
import { SelectModule } from "primeng/select";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { TextareaModule } from "primeng/textarea";
import { InputTextModule } from "primeng/inputtext";

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		FormLayoutDemoRoutingModule,
		AutoCompleteModule,
		DatePickerModule,
		ChipsModule,
		SelectModule,
		InputMaskModule,
		InputNumberModule,
		CascadeSelectModule,
		MultiSelectModule,
		TextareaModule,
		InputTextModule
	],
	declarations: [FormLayoutDemoComponent]
})
export class FormLayoutDemoModule { }
