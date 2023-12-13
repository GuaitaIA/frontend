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

  uploadFiles(files: File[]) {
    const formData = new FormData();

    files.forEach(file => {
      formData.append('imagenes', file);
    });

    formData.append('confianza', '0.5');
    formData.append('iou', '0.5');
    formData.append('cpu', '0');

    return this.httpClient.post<any>(`${environment.apiHost}/detectar_incendios/`, formData);
  }

  uploadStrings(urls: string[]) {
    const formData = new FormData();

    // unir las urls y separar por comas
    const urlsString = urls.join(',');
    formData.append('imagenes_strings', urlsString);

    formData.append('confianza', '0.5');
    formData.append('iou', '0.5');
    formData.append('cpu', '1');

    return this.httpClient.post<any>(`${environment.apiHost}/detectar_incendios/`, formData);
  }


}
