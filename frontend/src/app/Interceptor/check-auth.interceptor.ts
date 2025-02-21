import { Injectable } from '@angular/core';
import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, from, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { KeycloakService } from 'keycloak-angular';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(private keycloakService: KeycloakService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return from(this.keycloakService.getToken()).pipe(
      switchMap((token) => {
        if (token) {
          localStorage.setItem('token', token); // Ensure token is stored
          request = this.addAuthHeader(request); // Add Authorization header
        }
        return next.handle(request);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401 || error.status === 403) {
          return this.handleUnauthorizedError(request, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handleUnauthorizedError(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;

      return from(Promise.resolve(this.keycloakService.isTokenExpired(10))).pipe(
        switchMap((isAccessTokenExpired) => {
          if (isAccessTokenExpired) {
            const parsedRefreshToken = this.keycloakService.getKeycloakInstance().refreshTokenParsed;

            if (!parsedRefreshToken || !parsedRefreshToken.exp || this.isTokenExpired(parsedRefreshToken.exp)) {
              return this.forceLogout(); // 🔴 Only log out if refresh token is expired
            }

            return from(this.keycloakService.updateToken(30)).pipe(
              switchMap(() => from(this.keycloakService.getToken())),
              switchMap((newToken) => {
                localStorage.setItem('token', newToken);
                this.isRefreshing = false;
                return next.handle(this.addAuthHeader(request));
              }),
              catchError(() => this.forceLogout())
            );
          }
          return throwError(() => new Error('Unauthorized Access'));
        })
      );
    }
    return throwError(() => new Error('Token refresh already in progress'));
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const token = localStorage.getItem('token');
    if (token) {
      return request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
    return request;
  }

  private isTokenExpired(expiryTime: number): boolean {
    const currentTimeInSeconds = Math.floor(Date.now() / 1000);
    return expiryTime < currentTimeInSeconds;
  }

  private forceLogout() {
    this.isRefreshing = false;
    localStorage.removeItem('token');
    localStorage.clear();
    this.keycloakService.logout();
    console.log("Session expired. Redirecting to login...");

    return throwError(() => new Error('Session expired. Please log in again.'));
  }
}
