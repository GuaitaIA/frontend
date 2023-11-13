import { Component } from '@angular/core';
import { FileUploadHandlerEvent } from 'primeng/fileupload';
import { AnalyzeService } from '../services/analyze.service';
import { MenuItem } from 'primeng/api';

interface UploadEvent {
  originalEvent: Event;
  files: File[];
}

@Component({
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

  constructor(
    private analyzeService: AnalyzeService
  ) {}

  ngOnInit() {
    this.items = [
      { label: 'Imagenes', icon: 'pi pi-fw pi-images' },
      { label: 'URL/Base64', icon: 'pi pi-fw pi-globe' },
    ];

    this.activeItem = this.items[0];
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
    
}
