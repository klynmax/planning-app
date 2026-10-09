import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataCardsForm } from '../models/data-cards-forms.model';
import { CardDetails } from '../models/card-details.model';
import { PageResult } from '../../common/models/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/cards'

  create(date: DataCardsForm): Observable<CardDetails> {
    return this.http.post<CardDetails>(this.baseUrl, date);
  }

  getList(page: number = 0, size: number = 10): Observable<PageResult<CardDetails>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<CardDetails>>(url);
  }

  getById(id: string): Observable<CardDetails> {
    return this.http.get<CardDetails>(`${this.baseUrl}/${id}`);
  }

  update(id: string, data: DataCardsForm): Observable<void> {
    return this.http.put<void>(`${this.baseUrl}/${id}`, data);
  }

  updateStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, null);
  }
}
