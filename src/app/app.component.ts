import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PrimeNG } from 'primeng/config';
import { LayoutService } from './layout/service/app.layout.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    standalone: false
})
export class AppComponent implements OnInit, OnDestroy {
    private configSubscription?: Subscription;

    constructor(
        private primeng: PrimeNG,
        private layoutService: LayoutService
    ) {}

    ngOnInit() {
        this.applyPrimeNGConfig();
        this.configSubscription = this.layoutService.configUpdate$.subscribe(() => {
            this.applyPrimeNGConfig();
        });
    }

    ngOnDestroy() {
        this.configSubscription?.unsubscribe();
    }

    private applyPrimeNGConfig() {
        this.primeng.ripple.set(this.layoutService.config.ripple);
        this.primeng.inputVariant.set(this.layoutService.config.inputStyle === 'filled' ? 'filled' : 'outlined');
    }
}
