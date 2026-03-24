import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { finalize } from 'rxjs';
import { MessageService } from 'primeng/api';
import { NotificationCenterService } from 'src/app/core/services/notification-center.service';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  standalone: false
})
export class SettingsComponent implements OnInit {

  form!: FormGroup;
  loading = false;
  saving = false;

  constructor(
    private formBuilder: FormBuilder,
    private notificationCenterService: NotificationCenterService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.form = this.formBuilder.group({
      notifications_enabled: [true],
      notification_sound_enabled: [true],
    });

    this.loadSettings();
  }

  loadSettings() {
    this.loading = true;

    this.notificationCenterService.getSettings().pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: (settings) => {
        this.form.patchValue(settings, { emitEvent: false });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Ajustes',
          detail: error?.error?.detail ?? 'No se pudieron cargar los ajustes'
        });
      }
    });
  }

  save() {
    this.saving = true;

    this.notificationCenterService.updateSettings(
      !!this.form.get('notifications_enabled')?.value,
      !!this.form.get('notification_sound_enabled')?.value
    ).pipe(
      finalize(() => this.saving = false)
    ).subscribe({
      next: (settings) => {
        this.form.patchValue(settings, { emitEvent: false });
        this.messageService.add({
          severity: 'success',
          summary: 'Ajustes',
          detail: 'Los ajustes de notificaciones se han guardado'
        });
      },
      error: (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Ajustes',
          detail: error?.error?.detail ?? 'No se pudieron guardar los ajustes'
        });
      }
    });
  }

  async testSound() {
    try {
      await this.notificationCenterService.previewNotificationSound();
      this.messageService.add({
        severity: 'info',
        summary: 'Ajustes',
        detail: 'El sonido de alerta se ha reproducido correctamente'
      });
    } catch (error: any) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Ajustes',
        detail: error?.message ?? 'No se pudo reproducir el sonido de alerta'
      });
    }
  }
}
