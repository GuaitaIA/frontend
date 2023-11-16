import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class StatisticsService {

  constructor(
    private httpClient: HttpClient,
  ) { }

  getStatistics() {
    return this.httpClient.get<any>(`${environment.apiHost}/statistics/`);
  }
}
