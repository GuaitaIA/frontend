import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface OperatorDateItem {
  date: string;
}

export interface OperatorImageItem {
  id?: number;
  url_original?: string | null;
  url_processed?: string | null;
  positive?: boolean | string | null;
  confidence?: number | null;
  date?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class OperatorService {

  constructor(private httpClient: HttpClient) { }

  getDates() {
    return this.httpClient.get<OperatorDateItem[]>(`${environment.apiHost}/results/dates`);
  }

  getImagesByDate(date: string) {
    return this.httpClient.get<OperatorImageItem[]>(`${environment.apiHost}/results/images?date=${date}`);
  }

  getStatistics(date: string) {
    return this.httpClient.get<any>(`${environment.apiHost}/statistics/?date=${date}`);
  }

  updateDecision(id: number, value: boolean) {
    return this.httpClient.put<boolean>(`${environment.apiHost}/results/images/status?id=${id}&status=${value}`, {});
  }

  getConsoleData(date: string) {
    return forkJoin({
      statistics: this.getStatistics(date),
      images: this.getImagesByDate(date)
    });
  }
}
