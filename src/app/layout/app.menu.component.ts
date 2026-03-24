import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
    standalone: false
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.model = [
            {
                label: 'Home',
                items: [
                    { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
                    { label: 'Operador', icon: 'pi pi-fw pi-video', routerLink: ['/operator'] },
                    { label: 'Analizar', icon: 'pi pi-fw pi-camera', routerLink: ['/analyze'] },
                    { label: 'Resultados', icon: 'pi pi-fw pi-images', routerLink: ['/result'] },
                    { label: 'Usuarios', icon: 'pi pi-fw pi-users', routerLink: ['/users'] }
                ]
            },
        ];
    }
}
