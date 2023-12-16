import { Component, ViewEncapsulation } from '@angular/core';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { AnalyzeService } from '../services/analyze.service';
import { MenuItem, MessageService } from 'primeng/api';

import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

interface Cpu {
  name: string;
  code: number;
}

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-analyze',
  templateUrl: './analyze.component.html',
  styleUrls: ['./analyze.component.scss']
})
export class AnalyzeComponent {

  uploadedFiles: any[] = [];
  public results: any[];
  public analyze: boolean = false;

  public cpus: Cpu[] = [
    { name: 'CPU', code: 1 },
    { name: 'GPU', code: 0 },
  ];

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  formulario: FormGroup;

  show: boolean = true;

  confianza = 0.5;
  iou = 0.5;
  cpu = this.cpus[0];

  constructor(
    private analyzeService: AnalyzeService,
    private fb: FormBuilder,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Imagenes', icon: 'pi pi-fw pi-images' },
      { label: 'URL/Base64', icon: 'pi pi-fw pi-globe' },
    ];

    this.activeItem = this.items[0];

    this.formulario = this.fb.group({
      urls: this.fb.array([ this.fb.control('', Validators.required)]),
    });
  }

    onUpload(event:FileUploadHandlerEvent) {
      if(this.confianza && this.iou && this.cpu) {
        this.analyze = true;
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.analyzeService.uploadFiles(this.uploadedFiles, this.confianza, this.iou, this.cpu).subscribe(
          (response) => {
            this.results = response;
            this.analyze = false;
          },
          (error) => {
            console.log(error);
            if(error == 'Not allowed at this time') {
              this.results = [];
              this.analyze = false;
              this.showMessage();
            }
          }
        );
      }else {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Los datos no pueden estar vacios.' });
      }
    }

    onSelect() {
      this.results = [];
    }

    onActiveItemChange(event: MenuItem) {
      this.activeItem = event;
      console.log(this.activeItem);
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
      this.analyzeService.uploadStrings(this.formulario.value.urls, this.confianza, this.iou, this.cpu).subscribe(
        (response) => {
          this.results = response;
          this.analyze = false;
        },
        (error) => {
          console.log(error);
        }
      );
    }

    natejar() {
      this.show = true;
      this.formulario.reset();
      this.urls.clear();
      this.results = [];
      this.formulario = this.fb.group({
        urls: this.fb.array([ this.fb.control('', Validators.required)]),
        confianza: [0.5, Validators.required],
        iou: [0.5, Validators.required],
        cpu: [this.cpu[0], Validators.required],
      });
    }

    showMessage() {
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Fora de servei' });
    }
    
}
