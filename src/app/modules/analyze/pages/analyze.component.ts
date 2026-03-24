import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { AnalyzeModel, AnalyzeService } from '../services/analyze.service';
import { environment } from '../../../../environments/environment';

interface Cpu {
  name: string;
  code: number;
  disabled?: boolean;
}

interface ModelOption {
  name: string;
}

@Component({
    encapsulation: ViewEncapsulation.None,
    selector: 'app-analyze',
    templateUrl: './analyze.component.html',
    styleUrls: ['./analyze.component.scss'],
    standalone: false
})
export class AnalyzeComponent implements OnInit {
  uploadedFiles: File[] = [];
  public results: any[] = [];
  public analyze = false;
  public readonly apiHost = environment.apiHost;
  private readonly previewUrls = new Map<File, string>();

  public cpus: Cpu[] = [
    { name: 'CPU', code: 1 },
    { name: 'GPU', code: 0, disabled: true },
  ];
  public models: ModelOption[] = [];

  formulario!: FormGroup;

  show = true;
  activeTab: 'images' | 'urls' = 'images';

  confianza = 0.1;
  iou = 0.5;
  cpu = this.cpus[0];
  selectedModel: ModelOption | null = null;

  constructor(
    private analyzeService: AnalyzeService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.resetForm();
    this.loadModels();
  }

  ngOnDestroy() {
    this.clearPreviewUrls();
  }

  onUpload(event: FileUploadHandlerEvent) {
    if (this.confianza && this.iou && this.cpu && this.selectedModel) {
      this.analyze = true;
      this.uploadedFiles = [...event.files];

      this.analyzeService.uploadFiles(this.uploadedFiles, this.confianza, this.iou, this.cpu, this.selectedModel.name).subscribe(
        (response) => {
          this.results = response;
          this.analyze = false;
        },
        (error) => {
          console.log(error);
          this.results = [];
          this.analyze = false;
          this.showMessage(this.getErrorDetail(error));
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selecciona modelo, confianza, IOU y dispositivo.' });
    }
  }

  onSelect(event: { currentFiles?: File[]; files?: File[] }) {
    this.results = [];
    this.syncPreviewUrls(event.currentFiles ?? event.files ?? []);
  }

  onClear() {
    this.results = [];
    this.clearPreviewUrls();
  }

  onRemove(event: { file: File }) {
    if (event?.file) {
      this.releasePreviewUrl(event.file);
    }
  }

  get urls(): FormArray {
    return this.formulario.get('urls') as FormArray;
  }

  agregarUrl() {
    this.urls.push(this.fb.control('', Validators.required));
  }

  eliminarUrl(index: number) {
    this.urls.removeAt(index);
  }

  onSubmit() {
    if (!this.selectedModel) {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Selecciona un modelo antes de analizar.' });
      return;
    }

    this.show = false;
    this.analyze = true;
    this.results = [];

    this.analyzeService.uploadStrings(this.formulario.value.urls, this.confianza, this.iou, this.cpu, this.selectedModel.name).subscribe(
      (response) => {
        this.results = response;
        this.analyze = false;
      },
      (error) => {
        console.log(error);
        this.analyze = false;
        this.showMessage(this.getErrorDetail(error));
      }
    );
  }

  limpiar() {
    this.show = true;
    this.results = [];
    this.resetForm();
  }

  showMessage(detail = 'Servicio no disponible') {
    this.messageService.add({ severity: 'error', summary: 'Error', detail });
  }

  getPreviewUrl(file: File): string {
    const fileWithObjectUrl = file as File & { objectURL?: string };
    if (fileWithObjectUrl.objectURL) {
      return fileWithObjectUrl.objectURL;
    }

    const cachedUrl = this.previewUrls.get(file);
    if (cachedUrl) {
      return cachedUrl;
    }

    const previewUrl = URL.createObjectURL(file);
    this.previewUrls.set(file, previewUrl);

    return previewUrl;
  }

  formatSize(bytes: number): string {
    if (!bytes) {
      return '0 B';
    }

    const units = ['B', 'KB', 'MB', 'GB'];
    const unitIndex = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
    const value = bytes / Math.pow(1024, unitIndex);

    return `${value.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
  }

  private resetForm() {
    this.formulario = this.fb.group({
      urls: this.fb.array([this.fb.control('', Validators.required)]),
    });
  }

  private loadModels() {
    this.analyzeService.getModels().subscribe({
      next: (models: AnalyzeModel[]) => {
        this.models = models.map(model => ({ name: model.name }));
        const defaultModel = models.find(model => model.is_default) ?? models[0];
        this.selectedModel = defaultModel ? { name: defaultModel.name } : null;

        if (!this.selectedModel) {
          this.messageService.add({ severity: 'warn', summary: 'Modelos', detail: 'No hay modelos disponibles en la carpeta model.' });
        }
      },
      error: (error) => {
        console.log(error);
        this.messageService.add({ severity: 'error', summary: 'Modelos', detail: 'No se pudieron cargar los modelos.' });
      }
    });
  }

  private getErrorDetail(error: any) {
    if (typeof error?.error === 'string' && error.error.trim()) {
      return error.error;
    }

    return error?.error?.detail ?? error?.message ?? 'Servicio no disponible';
  }

  private syncPreviewUrls(files: File[]) {
    const activeFiles = new Set(files);

    for (const file of Array.from(this.previewUrls.keys())) {
      if (!activeFiles.has(file)) {
        this.releasePreviewUrl(file);
      }
    }
  }

  private releasePreviewUrl(file: File) {
    const previewUrl = this.previewUrls.get(file);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      this.previewUrls.delete(file);
    }
  }

  private clearPreviewUrls() {
    for (const previewUrl of this.previewUrls.values()) {
      URL.revokeObjectURL(previewUrl);
    }

    this.previewUrls.clear();
  }
}
