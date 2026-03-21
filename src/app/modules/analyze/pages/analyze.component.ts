import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { MessageService } from 'primeng/api';
import { AnalyzeService } from '../services/analyze.service';
import { environment } from '../../../../environments/environment';

interface Cpu {
  name: string;
  code: number;
  disabled?: boolean;
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

  formulario!: FormGroup;

  show = true;
  activeTab: 'images' | 'urls' = 'images';

  confianza = 0.5;
  iou = 0.5;
  cpu = this.cpus[0];

  constructor(
    private analyzeService: AnalyzeService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.resetForm();
  }

  ngOnDestroy() {
    this.clearPreviewUrls();
  }

  onUpload(event: FileUploadHandlerEvent) {
    if (this.confianza && this.iou && this.cpu) {
      this.analyze = true;
      this.uploadedFiles = [...event.files];

      this.analyzeService.uploadFiles(this.uploadedFiles, this.confianza, this.iou, this.cpu).subscribe(
        (response) => {
          this.results = response;
          this.analyze = false;
        },
        (error) => {
          console.log(error);
          if (error === 'Not allowed at this time') {
            this.results = [];
            this.analyze = false;
            this.showMessage();
          }
        }
      );
    } else {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Los datos no pueden estar vacios.' });
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
    this.show = false;
    this.analyze = true;
    this.results = [];

    this.analyzeService.uploadStrings(this.formulario.value.urls, this.confianza, this.iou, this.cpu).subscribe(
      (response) => {
        this.results = response;
        this.analyze = false;
      },
      (error) => {
        console.log(error);
        this.analyze = false;
      }
    );
  }

  limpiar() {
    this.show = true;
    this.results = [];
    this.resetForm();
  }

  showMessage() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fora de servei' });
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
