import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DataCardsForm } from '../models/data-cards-forms.model';
import { CardDetails } from '../models/card-details.model';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  http = inject(HttpClient);

  create(date: DataCardsForm): Observable<CardDetails> {
    const url = 'http://localhost:8080/cards'
    return this.http.post<CardDetails>(url, date);
  }
}
