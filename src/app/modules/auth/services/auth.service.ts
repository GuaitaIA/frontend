import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { co } from '@fullcalendar/core/internal-common';
import { BehaviorSubject, Observable, Subscription, map } from 'rxjs';
import { AppConstants } from 'src/app/app.constants';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  // private fields
  private unsubscribe: Subscription[] = [];
    
  // public fields
  public currentUser$: Observable<any>;
  public currentUserSubject: BehaviorSubject<any>;
  public isLoggedIn = false;

  get currentUserValue(): any {
    this.currentUserSubject.next(JSON.parse(localStorage.getItem(AppConstants.LOCAL_STORAGE_CURRENT_USER)));
    return this.currentUserSubject.value;
  }

  set currentUserValue(user: any) {
    this.currentUserSubject.next(user);
  }

  constructor(
    private httpClient: HttpClient,
    private router: Router,
  ) { 
    let user = undefined;
    if(localStorage.getItem(AppConstants.LOCAL_STORAGE_CURRENT_USER)){
        user = localStorage.getItem(AppConstants.LOCAL_STORAGE_CURRENT_USER);
    }
    this.currentUserSubject = new BehaviorSubject<any>(user);
    this.currentUser$ = this.currentUserSubject.asObservable();
  }

  login(email: string, password: string) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    return this.httpClient.post<any>(`${environment.apiHost}/token`, formData).pipe(
      map(response => {
        if (response && response.access_token) {
          this.isLoggedIn = true;
          this.currentUserValue = 'response';
          localStorage.setItem(AppConstants.LOCAL_STORAGE_CURRENT_USER, JSON.stringify(response));
        }
        return response;
      })
    );
  }

  logout() {
    localStorage.removeItem(AppConstants.LOCAL_STORAGE_CURRENT_USER);
    console.log('AuthService: logout: localStorage.removeItem(AppConstants.LOCAL_STORAGE_CURRENT_USER)');
    this.router.navigate(['/auth/login'], { queryParams: {} });
  }
}
