import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getResultsDates() {
    return this.httpClient.get<any>(`${environment.apiHost}/results/dates`);
  }

  getResultsByDate(date: string) {
    return this.httpClient.get<any>(`${environment.apiHost}/results/images?date=${date}`);
  }
}
