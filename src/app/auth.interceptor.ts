import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const userDataString = sessionStorage.getItem('user_data');
    const token = userDataString ? JSON.parse(userDataString).token : null;
    const isSSOLogin = sessionStorage.getItem('isSSOLogin') === 'true';
    // console.log(isSSOLogin);
    if (token) {
      let headers: Record<string, string> = {
        Authorization: `Bearer ${token}`,
      };
      if (isSSOLogin) {
        headers['login-type'] = 'SSO';
      }

      req = req.clone({
        setHeaders: headers,
      });
    }

    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          sessionStorage.clear();
          this.router.navigate(['/auth/login']);
        }
        return throwError(() => error);
      })
    );
  }
}
