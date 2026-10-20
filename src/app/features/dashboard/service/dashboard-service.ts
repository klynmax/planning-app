import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DashboardModel } from '../models/dashboard.model';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  http = inject(HttpClient);
  baseUrl = 'http://localhost:8080/dashboard';

  getDashboardCurrentMonth(): Observable<DashboardModel> {
    return this.http.get<DashboardModel>(this.baseUrl);
  }

}
