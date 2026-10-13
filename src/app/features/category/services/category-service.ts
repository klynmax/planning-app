import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { DataCategoryForms } from '../models/data-category-forms.model';
import { Observable } from 'rxjs';
import { CategoryDetails } from '../models/category-details.models';
import { PageResult } from '../../../shared/models/pagination/page-result';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/category';

  create(data: DataCategoryForms): Observable<CategoryDetails> {
    return this.http.post<CategoryDetails>(this.baseUrl, data);
  }

  getList(page: number = 0, size: number = 10): Observable<PageResult<CategoryDetails>> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<PageResult<CategoryDetails>>(url);
  }

  updateStatus(id: string): Observable<void> {
    return this.http.patch<void>(`${this.baseUrl}/${id}/status`, null);
  }
}
