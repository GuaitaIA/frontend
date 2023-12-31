import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  create(form: any) {
    const formData = new FormData();

    formData.append('email', form.email);
    formData.append('role', form.role.name);
    formData.append('zones_id', form.zones_id.id);
    formData.append('password', form.password);

    return this.httpClient.post<any>(`${environment.apiHost}/user/create`, formData);
  }

}
