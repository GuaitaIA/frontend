import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { BehaviorSubject, EMPTY, Subscription, catchError, exhaustMap, of, tap, timer } from 'rxjs';
import { environment } from 'src/environments/environment';
import { AuthService } from 'src/app/modules/auth/services/auth.service';

export interface NotificationSettings {
  notifications_enabled: boolean;
  notification_sound_enabled: boolean;
}

export interface AppNotification {
  id: number;
  title: string;
  message: string;
  detection_id?: number | null;
  created_at: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotificationCenterService implements OnDestroy {
  private static readonly audioUnlockEvents = ['pointerdown', 'keydown', 'touchstart'] as const;
  private authSubscription?: Subscription;
  private pollingSubscription?: Subscription;
  private initialized = false;
  private audioUnlockRegistered = false;
  private audioUnlocked = false;
  private pendingSoundPlayback = false;
  private notificationsEnabledSubject = new BehaviorSubject<boolean>(true);
  private notificationSoundEnabledSubject = new BehaviorSubject<boolean>(true);
  private notificationAudio?: HTMLAudioElement;

  readonly notificationsEnabled$ = this.notificationsEnabledSubject.asObservable();
  readonly notificationSoundEnabled$ = this.notificationSoundEnabledSubject.asObservable();

  constructor(
    private httpClient: HttpClient,
    private authService: AuthService,
    private messageService: MessageService
  ) { }

  private readonly handleAudioUnlock = () => {
    void this.unlockNotificationAudio();
  };

  initialize() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;
    this.registerAudioUnlockHandlers();
    this.authSubscription = this.authService.currentUser$.subscribe(user => {
      if (user?.access_token) {
        this.refreshSettings();
        this.startPolling();
        return;
      }

      this.notificationsEnabledSubject.next(true);
      this.notificationSoundEnabledSubject.next(true);
      this.pendingSoundPlayback = false;
      this.stopPolling();
    });
  }

  getSettings() {
    return this.httpClient.get<NotificationSettings>(`${environment.apiHost}/settings/notifications`).pipe(
      tap(settings => this.applySettings(settings))
    );
  }

  updateSettings(notificationsEnabled: boolean, notificationSoundEnabled: boolean) {
    return this.httpClient.patch<NotificationSettings>(`${environment.apiHost}/settings/notifications`, {
      notifications_enabled: notificationsEnabled,
      notification_sound_enabled: notificationSoundEnabled,
    }).pipe(
      tap(settings => this.applySettings(settings))
    );
  }

  async previewNotificationSound() {
    const audio = this.getNotificationAudio();
    if (!audio) {
      return;
    }

    this.pendingSoundPlayback = false;

    try {
      audio.muted = false;
      audio.currentTime = 0;
      await audio.play();
      this.audioUnlocked = true;
    } catch {
      throw new Error('No se pudo reproducir el sonido de alerta.');
    }
  }

  private refreshSettings() {
    this.getSettings().pipe(
      catchError(() => of({
        notifications_enabled: true,
        notification_sound_enabled: true,
      }))
    ).subscribe();
  }

  private applySettings(settings: NotificationSettings) {
    this.notificationsEnabledSubject.next(!!settings.notifications_enabled);
    this.notificationSoundEnabledSubject.next(!!settings.notification_sound_enabled);
  }

  private getNotificationAudio() {
    if (typeof Audio === 'undefined') {
      return undefined;
    }

    if (!this.notificationAudio) {
      this.notificationAudio = new Audio('assets/audio/fire-truck-siren.mp3');
      this.notificationAudio.preload = 'auto';
      this.notificationAudio.volume = 0.85;
    }

    return this.notificationAudio;
  }

  private registerAudioUnlockHandlers() {
    if (this.audioUnlockRegistered || typeof window === 'undefined') {
      return;
    }

    this.audioUnlockRegistered = true;
    for (const eventName of NotificationCenterService.audioUnlockEvents) {
      window.addEventListener(eventName, this.handleAudioUnlock, { passive: true });
    }
  }

  private removeAudioUnlockHandlers() {
    if (!this.audioUnlockRegistered || typeof window === 'undefined') {
      return;
    }

    this.audioUnlockRegistered = false;
    for (const eventName of NotificationCenterService.audioUnlockEvents) {
      window.removeEventListener(eventName, this.handleAudioUnlock);
    }
  }

  private async unlockNotificationAudio() {
    if (this.audioUnlocked) {
      if (this.pendingSoundPlayback) {
        this.pendingSoundPlayback = false;
        this.playNotificationSound();
      }
      return;
    }

    const audio = this.getNotificationAudio();
    if (!audio) {
      return;
    }

    try {
      audio.muted = true;
      audio.currentTime = 0;
      await audio.play();
      audio.pause();
      audio.currentTime = 0;
      audio.muted = false;
      this.audioUnlocked = true;

      if (this.pendingSoundPlayback && this.notificationSoundEnabledSubject.value) {
        this.pendingSoundPlayback = false;
        this.playNotificationSound();
      }
    } catch {
      audio.muted = false;
    }
  }

  private playNotificationSound() {
    if (!this.notificationSoundEnabledSubject.value) {
      return;
    }

    const audio = this.getNotificationAudio();
    if (!audio) {
      return;
    }

    try {
      audio.muted = false;
      audio.currentTime = 0;
      void audio.play().then(() => {
        this.audioUnlocked = true;
        this.pendingSoundPlayback = false;
      }).catch(() => {
        this.pendingSoundPlayback = true;
      });
    } catch {
      this.pendingSoundPlayback = true;
    }
  }

  ngOnDestroy() {
    this.authSubscription?.unsubscribe();
    this.stopPolling();
    this.removeAudioUnlockHandlers();
  }

  private startPolling() {
    if (this.pollingSubscription) {
      return;
    }

    this.pollingSubscription = timer(0, 15000).pipe(
      exhaustMap(() => this.httpClient.get<AppNotification[]>(`${environment.apiHost}/notifications/unread`).pipe(
        catchError((error) => {
          if (error?.status === 401) {
            this.stopPolling();
            return EMPTY;
          }

          return of([]);
        })
      ))
    ).subscribe(notifications => {
      if (!Array.isArray(notifications) || !notifications.length) {
        return;
      }

      this.notificationsEnabledSubject.next(true);
      this.playNotificationSound();

      for (const notification of notifications) {
        this.messageService.add({
          key: 'notification-stream',
          severity: 'warn',
          summary: notification.title,
          detail: notification.message,
          life: 9000,
        });
      }

      this.markNotificationsAsRead(notifications.map(notification => notification.id));
    });
  }

  private stopPolling() {
    this.pollingSubscription?.unsubscribe();
    this.pollingSubscription = undefined;
  }

  private markNotificationsAsRead(ids: number[]) {
    if (!ids.length) {
      return;
    }

    this.httpClient.patch(`${environment.apiHost}/notifications/read`, { ids }).pipe(
      catchError(() => of(null))
    ).subscribe();
  }
}
