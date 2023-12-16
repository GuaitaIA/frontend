import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AnalyzeService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  uploadFiles(files: File[], confianza: number, iou: number, cpu: any) {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('imagenes', file);
    });

    formData.append('confianza', confianza.toString());
    formData.append('iou', iou.toString());
    formData.append('cpu', cpu.code.toString());

    return this.httpClient.post<any>(`${environment.apiHost}/detectar_incendios/`, formData);
  }

  uploadStrings(urls: string[], confianza: number, iou: number, cpu: any) {
    const formData = new FormData();

    // unir las urls y separar por comas
    const urlsString = urls.join(',');
    formData.append('imagenes_strings', urlsString);

    formData.append('confianza', confianza.toString());
    formData.append('iou', iou.toString());
    formData.append('cpu', cpu.code.toString());

    return this.httpClient.post<any>(`${environment.apiHost}/detectar_incendios/`, formData);
  }


}
