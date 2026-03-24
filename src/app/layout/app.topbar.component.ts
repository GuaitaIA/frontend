import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';
import { AuthService } from '../modules/auth/services/auth.service';
import { LayoutService } from "./service/app.layout.service";

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    standalone: false
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private router: Router
    ) { }

    openSettings() {
        this.layoutService.state.profileSidebarVisible = false;
        void this.router.navigate(['/settings']);
    }

    logout() {
        this.layoutService.state.profileSidebarVisible = false;
        this.authService.logout();
    }
}
