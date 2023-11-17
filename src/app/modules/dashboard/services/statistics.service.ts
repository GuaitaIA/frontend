import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getStatistics(date?: string) {
    if(date) return this.httpClient.get<any>(`${environment.apiHost}/statistics?date=${date}`);
    else return this.httpClient.get<any>(`${environment.apiHost}/statistics/`);
  }
}
