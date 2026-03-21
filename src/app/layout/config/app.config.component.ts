import { Component, Input } from '@angular/core';
import { LayoutService } from '../service/app.layout.service';

@Component({
    selector: 'app-config',
    templateUrl: './app.config.component.html',
    standalone: false
})
export class AppConfigComponent {
    @Input() minimal = false;

    scales: number[] = [12, 13, 14, 15, 16];

    constructor(public layoutService: LayoutService) {}

    get visible(): boolean {
        return this.layoutService.state.configSidebarVisible;
    }

    set visible(value: boolean) {
        this.layoutService.state.configSidebarVisible = value;
    }

    get scale(): number {
        return this.layoutService.config.scale;
    }

    set scale(value: number) {
        this.layoutService.config.scale = value;
        this.layoutService.onConfigUpdate();
    }

    get menuMode(): string {
        return this.layoutService.config.menuMode;
    }

    set menuMode(value: string) {
        this.layoutService.config.menuMode = value;
        this.layoutService.onConfigUpdate();
    }

    get inputStyle(): string {
        return this.layoutService.config.inputStyle;
    }

    set inputStyle(value: string) {
        this.layoutService.config.inputStyle = value;
        this.layoutService.onConfigUpdate();
    }

    get ripple(): boolean {
        return this.layoutService.config.ripple;
    }

    set ripple(value: boolean) {
        this.layoutService.config.ripple = value;
        this.layoutService.onConfigUpdate();
    }

    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    decrementScale() {
        if (this.scale > this.scales[0]) {
            this.scale--;
            this.applyScale();
        }
    }

    incrementScale() {
        if (this.scale < this.scales[this.scales.length - 1]) {
            this.scale++;
            this.applyScale();
        }
    }

    applyScale() {
        document.documentElement.style.fontSize = `${this.scale}px`;
    }
}
