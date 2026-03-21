import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ContextMenuModule } from 'primeng/contextmenu';
import { InputTextModule } from 'primeng/inputtext';
import { MegaMenuModule } from 'primeng/megamenu';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { PanelMenuModule } from 'primeng/panelmenu';
import { StepsModule } from 'primeng/steps';
import { TieredMenuModule } from 'primeng/tieredmenu';
import { ConfirmationComponent } from './confirmation.component';
import { MenusComponent } from './menus.component';
import { PaymentComponent } from './payment.component';
import { PersonalComponent } from './personal.component';
import { SeatComponent } from './seat.component';

@NgModule({
	imports: [
		CommonModule,
		BreadcrumbModule,
		MenubarModule,
		StepsModule,
		TieredMenuModule,
		MenuModule,
		ButtonModule,
		ContextMenuModule,
		MegaMenuModule,
		PanelMenuModule,
		InputTextModule,
		RouterModule.forChild([
			{
				path: '', component: MenusComponent, children: [
					{ path: '', redirectTo: 'personal', pathMatch: 'full' },
					{ path: 'personal', component: PersonalComponent },
					{ path: 'confirmation', component: ConfirmationComponent },
					{ path: 'seat', component: SeatComponent },
					{ path: 'payment', component: PaymentComponent }
				]
			}
		])
	],
	declarations: [MenusComponent],
	exports: [RouterModule]
})
export class MenusModule { }
