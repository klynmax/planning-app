import { HttpInterceptorFn } from "@angular/common/http";
import { inject } from "@angular/core";
import { AuthService } from "./login/services/auth-service";
import { Router } from "@angular/router";
import { catchError, throwError } from "rxjs";

export const authInterceptor: HttpInterceptorFn = ( request, next ) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const isRequestAutentication = request.url.includes('/signin') ||
    request.url.includes('/signup');

  if(!isRequestAutentication && authService.isTokenExpired()) {
    authService.logout(false);
    router.navigate(['/login']);

    return throwError(() => new Error('Token expirado.'));
  }

  const token = authService.getToken();
  const requestModified = (!isRequestAutentication && token) ?
    request.clone({ setHeaders: { Authorization: `Bearer ${token}` } }) : request;

  return next(requestModified).pipe(
    catchError(error => {
      if(error.status === 401) {
        authService.logout(false);
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  )
}
