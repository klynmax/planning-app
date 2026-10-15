import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataReleaseForm } from '../models/data-release-form.model';
import { Observable } from 'rxjs';
import { ReleaseDetails } from '../models/releases-details.model';
import { CardDetails } from '../../cards/models/card-details.model';

@Injectable({
  providedIn: 'root',
})
export class ReleasesService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/releases';

  create(data: DataReleaseForm): Observable<ReleaseDetails> {
    return this.http.post<ReleaseDetails>(this.baseUrl, data);
  }

  getAvailableCategories(): Observable<ReleaseDetails[]> {
    return this.http.get<ReleaseDetails[]>(`${this.baseUrl}/available-categories`);
  }

  getAvailableCards(): Observable<CardDetails[]> {
    return this.http.get<CardDetails[]>(`${this.baseUrl}/available-cards`);
  }
}
