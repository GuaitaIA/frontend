import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize, forkJoin } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RoleHierarchyItem, UserItem, UsersService } from '../services/users.service';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-users',
    templateUrl: './users.component.html',
    styleUrls: ['./users.component.scss'],
    standalone: false
})
export class UsersComponent implements OnInit {

  users: UserItem[] = [];
  zones: SelectOption<number>[] = [];
  rolesHierarchy: RoleHierarchyItem[] = [];
  roles: SelectOption<string>[] = [];
  statuses: SelectOption<boolean>[] = [
    { label: 'Activo', value: true },
    { label: 'Inactivo', value: false },
  ];

  visible = false;
  deleteVisible = false;
  loading = false;
  submitting = false;
  editingUser: UserItem | null = null;
  userToDelete: UserItem | null = null;

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      role: ['', Validators.required],
      zones_id: [null, Validators.required],
      password: ['', Validators.required],
      is_active: [true, Validators.required],
    });

    this.loadData();
  }

  loadData() {
    this.loading = true;

    forkJoin({
      users: this.usersService.getUsers(),
      zones: this.usersService.getZones(),
      roles: this.usersService.getRoles(),
    }).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: ({ users, zones, roles }) => {
        this.users = users;
        this.rolesHierarchy = roles;
        this.roles = this.buildRoleOptions(roles);
        this.zones = zones.map(zone => ({
          label: `${zone.timezone} (${zone.start_time}:00-${zone.end_time}:00)`,
          value: zone.id,
        }));

        if (!this.editingUser && !this.visible) {
          this.form.patchValue({
            role: this.getDefaultRoleValue(),
            zones_id: this.zones[0]?.value ?? null,
          }, { emitEvent: false });
        }
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Usuarios', detail: this.getErrorMessage(error, 'No se pudieron cargar los usuarios') });
      }
    });
  }

  add() {
    this.editingUser = null;
    this.userToDelete = null;
    this.setPasswordRequired(true);
    this.form.reset({
      email: '',
      role: this.getDefaultRoleValue(),
      zones_id: this.zones[0]?.value ?? null,
      password: '',
      is_active: true,
    });
    this.visible = true;
  }

  edit(user: UserItem) {
    this.editingUser = user;
    this.setPasswordRequired(false);
    this.form.reset({
      email: user.email,
      role: user.role,
      zones_id: user.zones_id ?? this.zones[0]?.value ?? null,
      password: '',
      is_active: user.is_active,
    });
    this.visible = true;
  }

  askDelete(user: UserItem) {
    this.userToDelete = user;
    this.deleteVisible = true;
  }

  closeDialog() {
    this.visible = false;
    this.submitting = false;
    this.editingUser = null;
  }

  closeDeleteDialog() {
    this.deleteVisible = false;
    this.userToDelete = null;
  }

  submit() {
    this.submitting = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    const payload = {
      email: rawValue.email.trim(),
      role: rawValue.role,
      zones_id: rawValue.zones_id,
      is_active: rawValue.is_active,
      password: rawValue.password?.trim() || undefined,
    };

    const request = this.editingUser
      ? this.usersService.update(this.editingUser.id, payload)
      : this.usersService.create(payload);
    const isEditing = !!this.editingUser;

    request.subscribe({
      next: () => {
        this.closeDialog();
        this.loadData();
        this.messageService.add({
          severity: 'success',
          summary: 'Usuarios',
          detail: isEditing ? 'Usuario actualizado correctamente' : 'Usuario creado correctamente'
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Usuarios', detail: this.getErrorMessage(error, 'No se pudo guardar el usuario') });
      }
    });
  }

  confirmDelete() {
    if (!this.userToDelete) {
      return;
    }

    this.usersService.remove(this.userToDelete.id).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.loadData();
        this.messageService.add({ severity: 'success', summary: 'Usuarios', detail: 'Usuario eliminado correctamente' });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({ severity: 'error', summary: 'Usuarios', detail: this.getErrorMessage(error, 'No se pudo eliminar el usuario') });
      }
    });
  }

  formatRoleName(role: string) {
    return (role || '').trim();
  }

  private buildRoleOptions(roles: RoleHierarchyItem[]) {
    return roles.map(role => ({
      label: `${'\u00A0\u00A0\u00A0'.repeat(role.depth)}${role.depth ? '↳ ' : ''}${this.formatRoleName(role.name)}`,
      value: role.name,
    }));
  }

  private getDefaultRoleValue() {
    const userRole = this.rolesHierarchy.find(role => role.name === 'user');
    return userRole?.name ?? this.rolesHierarchy[0]?.name ?? '';
  }

  private setPasswordRequired(required: boolean) {
    const passwordControl = this.form.get('password');
    if (!passwordControl) {
      return;
    }

    passwordControl.setValidators(required ? [Validators.required] : []);
    passwordControl.updateValueAndValidity();
  }

  private getErrorMessage(error: any, fallback: string) {
    return error?.error?.detail ?? fallback;
  }
}
