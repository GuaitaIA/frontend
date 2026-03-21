import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ListDemoComponent } from './listdemo.component';
import { ListDemoRoutingModule } from './listdemo-routing.module';
import { DataViewModule } from 'primeng/dataview';
import { PickListModule } from 'primeng/picklist';
import { OrderListModule } from 'primeng/orderlist';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { RatingModule } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ListDemoRoutingModule,
		DataViewModule,
		PickListModule,
		OrderListModule,
		InputTextModule,
		SelectModule,
		RatingModule,
		ButtonModule
	],
	declarations: [ListDemoComponent]
})
export class ListDemoModule { }
