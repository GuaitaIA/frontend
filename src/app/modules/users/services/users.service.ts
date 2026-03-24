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

export interface RoleHierarchyItem {
  id: number;
  name: string;
  description?: string | null;
  parent_id?: number | null;
  parent_name?: string | null;
  depth: number;
  users_count: number;
  is_protected: boolean;
}

export interface UserPayload {
  email: string;
  role: string;
  zones_id: number;
  is_active: boolean;
  password?: string;
}

export interface RolePayload {
  name: string;
  description?: string;
  parent_id?: number | null;
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

  getRoles(): Observable<RoleHierarchyItem[]> {
    return this.httpClient.get<RoleHierarchyItem[]>(`${environment.apiHost}/roles`);
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

  createRole(form: RolePayload) {
    return this.httpClient.post<any>(`${environment.apiHost}/roles`, this.buildRoleFormData(form));
  }

  updateRole(roleId: number, form: RolePayload) {
    return this.httpClient.put<any>(`${environment.apiHost}/roles/${roleId}`, this.buildRoleFormData(form));
  }

  removeRole(roleId: number) {
    return this.httpClient.delete<any>(`${environment.apiHost}/roles/${roleId}`);
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

  private buildRoleFormData(form: RolePayload) {
    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('description', form.description?.trim() || '');

    if (form.parent_id !== null && form.parent_id !== undefined) {
      formData.append('parent_id', String(form.parent_id));
    }

    return formData;
  }
}
