import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { RoleHierarchyItem, UsersService } from '../../users/services/users.service';

interface SelectOption<T> {
  label: string;
  value: T;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-roles',
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.scss'],
  standalone: false
})
export class RolesComponent implements OnInit {

  roles: RoleHierarchyItem[] = [];
  parentOptions: SelectOption<number | null>[] = [];

  visible = false;
  deleteVisible = false;
  loading = false;
  submitting = false;
  editingRole: RoleHierarchyItem | null = null;
  roleToDelete: RoleHierarchyItem | null = null;

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private usersService: UsersService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required, Validators.maxLength(60)]],
      description: ['', [Validators.maxLength(255)]],
      parent_id: [null],
    });

    this.loadRoles();
  }

  loadRoles() {
    this.loading = true;

    this.usersService.getRoles().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (roles) => {
        this.roles = roles;
        this.parentOptions = this.buildParentOptions();
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Jerarquia',
          detail: this.getErrorMessage(error, 'No se pudo cargar la jerarquia de roles')
        });
      }
    });
  }

  add() {
    this.editingRole = null;
    this.form.reset({
      name: '',
      description: '',
      parent_id: null,
    });
    this.parentOptions = this.buildParentOptions();
    this.visible = true;
  }

  edit(role: RoleHierarchyItem) {
    this.editingRole = role;
    this.form.reset({
      name: role.name,
      description: role.description ?? '',
      parent_id: role.parent_id ?? null,
    });
    this.parentOptions = this.buildParentOptions(role.id);
    this.visible = true;
  }

  askDelete(role: RoleHierarchyItem) {
    this.roleToDelete = role;
    this.deleteVisible = true;
  }

  closeDialog() {
    this.visible = false;
    this.submitting = false;
    this.editingRole = null;
  }

  closeDeleteDialog() {
    this.deleteVisible = false;
    this.roleToDelete = null;
  }

  submit() {
    this.submitting = true;

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const rawValue = this.form.getRawValue();
    const payload = {
      name: rawValue.name.trim(),
      description: rawValue.description?.trim() || undefined,
      parent_id: rawValue.parent_id ?? null,
    };

    const request = this.editingRole
      ? this.usersService.updateRole(this.editingRole.id, payload)
      : this.usersService.createRole(payload);
    const isEditing = !!this.editingRole;

    request.subscribe({
      next: () => {
        this.closeDialog();
        this.loadRoles();
        this.messageService.add({
          severity: 'success',
          summary: 'Jerarquia',
          detail: isEditing ? 'Rol actualizado correctamente' : 'Rol creado correctamente'
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Jerarquia',
          detail: this.getErrorMessage(error, 'No se pudo guardar el rol')
        });
      }
    });
  }

  confirmDelete() {
    if (!this.roleToDelete) {
      return;
    }

    this.usersService.removeRole(this.roleToDelete.id).subscribe({
      next: () => {
        this.closeDeleteDialog();
        this.loadRoles();
        this.messageService.add({
          severity: 'success',
          summary: 'Jerarquia',
          detail: 'Rol eliminado correctamente'
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Jerarquia',
          detail: this.getErrorMessage(error, 'No se pudo eliminar el rol')
        });
      }
    });
  }

  formatRoleName(role: string) {
    return (role || '').trim();
  }

  canDelete(role: RoleHierarchyItem) {
    return !role.is_protected && role.users_count === 0 && !this.hasChildren(role.id);
  }

  private hasChildren(roleId: number) {
    return this.roles.some(role => role.parent_id === roleId);
  }

  private buildParentOptions(excludedRoleId?: number) {
    return [
      { label: 'Sin padre (nivel raiz)', value: null },
      ...this.roles
        .filter(role => role.id !== excludedRoleId)
        .map(role => ({
          label: `${'\u00A0\u00A0\u00A0'.repeat(role.depth)}${role.depth ? '↳ ' : ''}${this.formatRoleName(role.name)}`,
          value: role.id,
        })),
    ];
  }

  private getErrorMessage(error: any, fallback: string) {
    return error?.error?.detail ?? fallback;
  }
}
