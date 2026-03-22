import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConstants } from 'src/app/app.constants';
import { finalize } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `],
    standalone: false
})
export class LoginComponent{

    public password!: string;
    public loginForm: FormGroup;
    public isLoading: boolean;
    public returnUrl: string;
    public loginError: string;

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private fb: FormBuilder,
        private router: Router,
        private route: ActivatedRoute,
    ) { 
        this.isLoading = false;
        this.loginError = '';

        // redirect to home if already logged in
        if (this.authService.currentUserValue) {
            this.router.navigate([AppConstants.HOME_URL]);
        }
    }

    ngOnInit() {
        console.log('LoginComponent: ngOnInit');
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required, Validators.minLength(2)]],
        })

        this.returnUrl = this.route.snapshot.queryParams['returnUrl'.toString()] || AppConstants.HOME_URL;
    }

    onSubmit(loginForm: FormGroup) {
        this.loginError = '';

        if (loginForm.invalid) {
            loginForm.markAllAsTouched();
            return;
        }

        this.isLoading = true;
        this.authService.login(loginForm.value.email, loginForm.value.password).pipe(
            finalize(() => this.isLoading = false)
        ).subscribe(
            response => {
                if (response) {
                    this.router.navigate([this.returnUrl])
                };
            },
            error => {
                console.log('LoginComponent: onSubmit: error', error);
                this.loginError = this.getLoginErrorMessage(error);
            }
        );
    }

    private getLoginErrorMessage(error: any) {
        const detail = error?.error?.detail;

        if (detail === 'User not found' || error?.status === 404) {
            return 'El usuario no existe.';
        }

        if (detail === 'Inactive user' || error?.status === 403) {
            return 'Tu usuario está bloqueado. Contacta con un administrador.';
        }

        if (detail === 'Incorrect password' || error?.status === 401) {
            return 'La contraseña no es correcta.';
        }

        return 'No se ha podido iniciar sesión.';
    }

}
