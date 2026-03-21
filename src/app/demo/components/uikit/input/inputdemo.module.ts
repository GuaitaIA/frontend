import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InputDemoComponent } from './inputdemo.component';
import { InputDemoRoutingModule } from './inputdemo-routing.module';
import { AutoCompleteModule } from "primeng/autocomplete";
import { DatePickerModule } from "primeng/datepicker";
import { ChipsModule } from "primeng/chips";
import { ChipModule } from "primeng/chip";
import { SelectModule } from "primeng/select";
import { InputMaskModule } from "primeng/inputmask";
import { InputNumberModule } from "primeng/inputnumber";
import { CascadeSelectModule } from "primeng/cascadeselect";
import { MultiSelectModule } from "primeng/multiselect";
import { TextareaModule } from "primeng/textarea";
import { InputTextModule } from "primeng/inputtext";
import { RatingModule } from 'primeng/rating';
import { KnobModule } from 'primeng/knob';
import { ListboxModule } from 'primeng/listbox';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ColorPickerModule } from 'primeng/colorpicker';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { SliderModule } from 'primeng/slider';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		InputDemoRoutingModule,
		AutoCompleteModule,
		DatePickerModule,
		ChipsModule,
		SelectModule,
		InputMaskModule,
		InputNumberModule,
		ColorPickerModule,
		CascadeSelectModule,
		MultiSelectModule,
		ToggleButtonModule,
		SliderModule,
		TextareaModule,
		RadioButtonModule,
		InputTextModule,
		RatingModule,
		ChipModule,
		KnobModule,
		ToggleSwitchModule,
		ListboxModule,
		SelectButtonModule,
		CheckboxModule,
		ButtonModule
	],
	declarations: [InputDemoComponent]
})
export class InputDemoModule { }
