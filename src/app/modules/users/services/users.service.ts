import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface UserItem {
  id: number;
  email: string;
  role: string;
  is_active: boolean;
  zones_id: number;
  timezone: string;
}

export interface ZoneItem {
  id: number;
  timezone: string;
  start_time: number;
  end_time: number;
}

export interface UserPayload {
  email: string;
  role: string;
  zones_id: number;
  is_active: boolean;
  password?: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getUsers(): Observable<UserItem[]> {
    return this.httpClient.get<UserItem[]>(`${environment.apiHost}/users`);
  }

  getZones(): Observable<ZoneItem[]> {
    return this.httpClient.get<ZoneItem[]>(`${environment.apiHost}/zones`);
  }

  create(form: UserPayload) {
    return this.httpClient.post<any>(`${environment.apiHost}/user/create`, this.buildFormData(form));
  }

  update(userId: number, form: UserPayload) {
    return this.httpClient.put<any>(`${environment.apiHost}/user/${userId}`, this.buildFormData(form));
  }

  remove(userId: number) {
    return this.httpClient.delete<any>(`${environment.apiHost}/user/${userId}`);
  }

  private buildFormData(form: UserPayload) {
    const formData = new FormData();

    formData.append('email', form.email);
    formData.append('role', form.role);
    formData.append('zones_id', String(form.zones_id));
    formData.append('is_active', String(form.is_active));

    if (form.password) {
      formData.append('password', form.password);
    }

    return formData;
  }
}
