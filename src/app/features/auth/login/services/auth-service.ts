import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { AuthResponse } from '../models/auth-response.model';
import { RegisterUserForm } from '../models/register-user-form.model';
import { LoginFormModel } from '../models/login-form.model';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';

interface jwtPayload {
  exp?: number;
  name?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenKey = 'token_session';
  private readonly userNameKey = 'user_name';
  private logoutTimer?: ReturnType<typeof setTimeout>;

  http = inject(HttpClient);
  router = inject(Router);
  baseUrl = 'http://localhost:8080/auth';

  login(data: LoginFormModel): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signin`, data)
      .pipe(tap(response => this.initSession(response)));
  }


  register(data: RegisterUserForm): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.baseUrl}/signup`, data)
      .pipe(tap(response => this.initSession(response)));
  }

  initSession(response: AuthResponse) {
    const token = response.token;
    localStorage.setItem(this.tokenKey, token);
    localStorage.setItem(this.userNameKey, response.name);
    this.toScheduleExpiration();
  }

  initSessionSave() {
    if(this.isTokenExpired()) {
      this.logout(false);
      return;
    }

    this.toScheduleExpiration();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  isAutenticate(): boolean {
    if(!this.getToken()) {
      return false;
    }

    return !this.isTokenExpired();
  }

  isTokenExpired(): boolean {
    const exp = this.getTokenExpiration();
    if(!exp) {
      return true;
    }

    return Date.now() >= exp * 1000;
  }

  logout(redirection = true) : void{
    localStorage.removeItem(this.tokenKey);
    localStorage.removeItem(this.userNameKey);

    if(this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    if(redirection) {
      this.router.navigate(['/login']);
    }
  }

  toScheduleExpiration() {
    const exp = this.getTokenExpiration();

    if(!exp) {
      return;
    }

    if(this.logoutTimer) {
      clearTimeout(this.logoutTimer);
    }

    const timeRemaining = (exp * 1000) - Date.now();

    if(timeRemaining <= 0) {
      this.logout();
      return;
    }

    this.logoutTimer = setTimeout(() => this.logout(), timeRemaining);
  }

  getTokenExpiration(): number | null {
    const token = this.getToken();
    if(!token) {
      return null;
    }

    try{
      const payload = jwtDecode<jwtPayload>(token);
      if(!payload.exp) {
        return null;
      }
      return payload.exp;
    } catch {
      return null
    }
  }
}
