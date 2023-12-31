import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NotfoundComponent } from './demo/components/notfound/notfound.component';
import { AppLayoutComponent } from "./layout/app.layout.component";
import { AuthGuard } from './core/guards/auth.guard';

@NgModule({
    imports: [
        RouterModule.forRoot([
             {
                path: '', component: AppLayoutComponent,
                children: [
                    { path: '', loadChildren: () => import('./modules/dashboard/pages/dashboard.module').then(m => m.DashboardModule) },
                    { path: 'analyze', loadChildren: () => import('./modules/analyze/pages/analyze.module').then(m => m.AnalyzeModule) },
                    { path: 'result', loadChildren: () => import('./modules/result/pages/result.module').then(m => m.ResultModule) },
                    { path: 'users', loadChildren: () => import('./modules/users/pages/users.module').then(m => m.UsersModule) },
                ],
                canActivate: [AuthGuard]
            }, 
            { 
                path: 'auth', 
                data: { breadcrumb: 'Auth' }, 
                loadChildren: () => import('./modules/auth/auth.module').then((m) => m.AuthModule),
            },
            { path: 'notfound', component: NotfoundComponent },
            { path: '**', redirectTo: '/notfound' },
        ], { scrollPositionRestoration: 'enabled', anchorScrolling: 'enabled', onSameUrlNavigation: 'reload' })
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
