import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterUserForm } from '../models/register-user-form.model';
import { LoginFormModel } from '../models/login-form.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  http = inject(HttpClient)
  baseUrl = 'http://localhost:8080/auth'

  login(data: LoginFormModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, data);
  }


  register(data: RegisterUserForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, data);
  }
}
