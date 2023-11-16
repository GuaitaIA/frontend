import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, map, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/services/auth.service';
import { AppConstants } from 'src/app/app.constants';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private authService: AuthService,
    ) {}

    intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
        // add authorization header with jwt token if available
        if(localStorage.getItem(AppConstants.LOCAL_STORAGE_CURRENT_USER)){
            const authModel = JSON.parse(localStorage.getItem(AppConstants.LOCAL_STORAGE_CURRENT_USER));
            if(authModel && authModel['access_token']) {
                request = request.clone({
                    setHeaders: {
                        Authorization: `Bearer ${authModel['access_token']}`
                    }
                });
            }
        }

        return next.handle(request).pipe(
            catchError((error:HttpErrorResponse | undefined) => {
                if(error?.status === 401) {
                    if(!environment.production) console.log(error);
                    this.authService.logout();
                    return throwError(() => error?.error?.errors.shift());
                }
                if(!environment.production) console.log(error);
                return throwError(() => error?.error?.detail);
            })
        );
    }
}
