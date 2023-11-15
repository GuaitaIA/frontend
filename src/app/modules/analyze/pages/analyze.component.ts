import { Component, ViewEncapsulation } from '@angular/core';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { AnalyzeService } from '../services/analyze.service';
import { MenuItem } from 'primeng/api';

import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
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

  items: MenuItem[] | undefined;
  activeItem: MenuItem | undefined;

  formulario: FormGroup;

  show: boolean = true;

  constructor(
    private analyzeService: AnalyzeService,
    private fb: FormBuilder
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
      this.analyze = true;
        for(let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.analyzeService.uploadFiles(this.uploadedFiles).subscribe(
          (response) => {
            this.results = response;
            this.analyze = false;
          },
          (error) => {
            console.log(error);
          }
        );
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
      console.log(this.formulario.value);
      this.analyzeService.uploadStrings(this.formulario.value.urls).subscribe(
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
      });
    }
    
}
