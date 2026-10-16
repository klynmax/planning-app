import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataReleaseForm } from '../models/data-release-form.model';
import { Observable } from 'rxjs';
import { ReleaseDetails } from '../models/releases-details.model';
import { CardDetails } from '../../cards/models/card-details.model';
import { CategoryDetails } from '../../category/models/category-details.models';
import { ReleaseFilter } from '../models/releases-filter.model';
import { PageResult } from '../../../shared/models/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class ReleasesService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/releases';

  create(data: DataReleaseForm): Observable<ReleaseDetails> {
    return this.http.post<ReleaseDetails>(this.baseUrl, data);
  }

  getAvailableCategories(): Observable<CategoryDetails[]> {
    return this.http.get<CategoryDetails[]>(`${this.baseUrl}/available-categories`);
  }

  getAvailableCards(): Observable<CardDetails[]> {
    return this.http.get<CardDetails[]>(`${this.baseUrl}/available-cards`);
  }

  getList(filters: ReleaseFilter): Observable<PageResult<ReleaseDetails>> {
    let params = new HttpParams();

    if(filters.month) {
      params = params.set('month', filters.month);
    }

    if(filters.type) {
      params = params.set('type', filters.type);
    }

    if(filters.categoryId) {
      params = params.set('category-id', filters.categoryId);
    }

    let page = filters.page ?? 0;
    let size = filters.size ?? 10;

    params = params.set('page', page).set('size', size);

    return this.http.get<PageResult<ReleaseDetails>>(this.baseUrl, {params: params});
  }

  getCategoryFilterAll(): Observable<CategoryDetails[]> {
    return this.http.get<CategoryDetails[]>(`${this.baseUrl}/release-list-all`);
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
