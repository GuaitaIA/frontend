import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { finalize, Subscription, timer } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { OperatorImageItem, OperatorService } from '../services/operator.service';

type DetectionStatus = 'pending' | 'confirmed' | 'discarded';

interface DetectionCard {
  id: number | null;
  label: string;
  processedUrl: string | null;
  originalUrl: string | null;
  confidence: number | null;
  date: string | null;
  status: DetectionStatus;
}

interface SummaryCard {
  label: string;
  value: number;
  tone: 'neutral' | 'alert' | 'success' | 'muted';
}

interface HourActivity {
  hour: string;
  total: number;
  detections: number;
  notDetections: number;
  detectionWidth: number;
  notDetectionWidth: number;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-operator',
  templateUrl: './operator.component.html',
  styleUrls: ['./operator.component.scss'],
  standalone: false
})
export class OperatorComponent implements OnInit, OnDestroy {
  readonly apiHost = environment.apiHost;

  loading = true;
  updatingDecision = false;
  selectedDate = this.getToday();
  availableDates: string[] = [this.selectedDate];
  detections: DetectionCard[] = [];
  selectedDetection: DetectionCard | null = null;
  summaryCards: SummaryCard[] = [];
  hourlyActivity: HourActivity[] = [];
  lastRefresh: Date | null = null;
  refreshLabel = 'Sin actualizar';

  private refreshSubscription?: Subscription;

  constructor(private operatorService: OperatorService) { }

  ngOnInit() {
    this.loadDates();
    this.refreshSubscription = timer(45000, 45000).subscribe(() => {
      this.loadConsole(this.selectedDate, false);
    });
  }

  ngOnDestroy() {
    this.refreshSubscription?.unsubscribe();
  }

  get pendingDetections() {
    return this.detections.filter(item => item.status === 'pending').length;
  }

  get reviewedDetections() {
    return this.detections.filter(item => item.status !== 'pending').length;
  }

  get selectedImageUrl() {
    return this.selectedDetection?.processedUrl ?? null;
  }

  get selectedOriginalImageUrl() {
    return this.selectedDetection?.originalUrl ?? null;
  }

  loadDates() {
    this.operatorService.getDates().subscribe({
      next: (dates) => {
        const apiDates = dates
          .map(item => item?.date)
          .filter((value): value is string => !!value);

        this.availableDates = Array.from(new Set([this.getToday(), ...apiDates])).slice(0, 7);

        if (!this.availableDates.includes(this.selectedDate)) {
          this.selectedDate = this.availableDates[0];
        }

        this.loadConsole(this.selectedDate, true);
      },
      error: () => {
        this.availableDates = [this.getToday()];
        this.selectedDate = this.availableDates[0];
        this.loadConsole(this.selectedDate, true);
      }
    });
  }

  selectDate(date: string) {
    if (date === this.selectedDate) {
      return;
    }

    this.selectedDate = date;
    this.loadConsole(date, true);
  }

  selectDetection(detection: DetectionCard) {
    this.selectedDetection = detection;
  }

  confirmDetection() {
    this.updateSelectedDecision(true);
  }

  discardDetection() {
    this.updateSelectedDecision(false);
  }

  manualRefresh() {
    this.loadConsole(this.selectedDate, false);
  }

  statusLabel(status: DetectionStatus) {
    switch (status) {
      case 'confirmed':
        return 'Confirmada';
      case 'discarded':
        return 'Descartada';
      default:
        return 'Pendiente';
    }
  }

  statusSeverity(status: DetectionStatus) {
    switch (status) {
      case 'confirmed':
        return 'success';
      case 'discarded':
        return 'danger';
      default:
        return 'warn';
    }
  }

  confidencePercent(confidence: number | null) {
    return confidence === null ? '--' : `${Math.round(confidence * 100)}%`;
  }

  cardClass(tone: SummaryCard['tone']) {
    return `operator-summary-card--${tone}`;
  }

  private loadConsole(date: string, withLoader: boolean) {
    if (withLoader) {
      this.loading = true;
    }

    this.operatorService.getConsoleData(date).pipe(
      finalize(() => this.loading = false)
    ).subscribe({
      next: ({ statistics, images }) => {
        this.detections = this.mapDetections(images);
        this.summaryCards = this.mapSummary(statistics, this.detections);
        this.hourlyActivity = this.mapHourlyActivity(statistics);

        const selectedId = this.selectedDetection?.id;
        this.selectedDetection = this.detections.find(item => item.id === selectedId)
          ?? this.detections.find(item => item.status === 'pending')
          ?? this.detections[0]
          ?? null;

        this.lastRefresh = new Date();
        this.refreshLabel = this.lastRefresh.toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        });
      },
      error: () => {
        this.detections = [];
        this.selectedDetection = null;
        this.summaryCards = this.getEmptySummary();
        this.hourlyActivity = [];
      }
    });
  }

  private updateSelectedDecision(value: boolean) {
    if (!this.selectedDetection?.id) {
      return;
    }

    this.updatingDecision = true;
    this.operatorService.updateDecision(this.selectedDetection.id, value).pipe(
      finalize(() => this.updatingDecision = false)
    ).subscribe({
      next: () => this.loadConsole(this.selectedDate, false),
      error: () => this.loadConsole(this.selectedDate, false)
    });
  }

  private mapDetections(items: OperatorImageItem[]): DetectionCard[] {
    return items.map((item, index) => ({
      id: item.id ?? null,
      label: `Detección ${item.id ?? index + 1}`,
      processedUrl: item.url_processed ? `${this.apiHost}/imagenes/${item.url_processed}` : null,
      originalUrl: item.url_original ? `${this.apiHost}/imagenes_original/${item.url_original}` : null,
      confidence: item.confidence ?? null,
      date: item.date ?? null,
      status: this.normalizeStatus(item.positive)
    }));
  }

  private mapSummary(statistics: any, detections: DetectionCard[]): SummaryCard[] {
    const totals = statistics?.[0]?.[0] ?? {};
    const validations = statistics?.[2]?.[0] ?? {};
    const pending = detections.filter(item => item.status === 'pending').length;

    return [
      {
        label: 'Analizadas',
        value: Number(totals.total_sum ?? (totals.detections ?? 0) + (totals.not_detections ?? 0)),
        tone: 'neutral'
      },
      {
        label: 'Pendientes',
        value: pending,
        tone: 'alert'
      },
      {
        label: 'Confirmadas',
        value: Number(validations.true_detections ?? 0),
        tone: 'success'
      },
      {
        label: 'Descartadas',
        value: Number(validations.false_detections ?? 0),
        tone: 'muted'
      }
    ];
  }

  private mapHourlyActivity(statistics: any): HourActivity[] {
    const entries = statistics?.[1] ?? [];
    const highestTotal = entries.reduce((max: number, item: any) => {
      const total = Number(item.total_detections ?? 0) + Number(item.total_not_detections ?? 0);
      return Math.max(max, total);
    }, 0);

    return entries.slice(-8).map((item: any) => {
      const detections = Number(item.total_detections ?? 0);
      const notDetections = Number(item.total_not_detections ?? 0);
      const total = detections + notDetections;

      return {
        hour: new Date(item.hour).toLocaleTimeString('es-ES', {
          hour: '2-digit',
          minute: '2-digit'
        }),
        detections,
        notDetections,
        total,
        detectionWidth: highestTotal ? (detections / highestTotal) * 100 : 0,
        notDetectionWidth: highestTotal ? (notDetections / highestTotal) * 100 : 0
      };
    });
  }

  private normalizeStatus(value: boolean | string | null | undefined): DetectionStatus {
    if (value === true || value === 'true') {
      return 'confirmed';
    }

    if (value === false || value === 'false') {
      return 'discarded';
    }

    return 'pending';
  }

  private getToday() {
    return new Date().toISOString().slice(0, 10);
  }

  private getEmptySummary(): SummaryCard[] {
    return [
      { label: 'Analizadas', value: 0, tone: 'neutral' },
      { label: 'Pendientes', value: 0, tone: 'alert' },
      { label: 'Confirmadas', value: 0, tone: 'success' },
      { label: 'Descartadas', value: 0, tone: 'muted' }
    ];
  }
}
