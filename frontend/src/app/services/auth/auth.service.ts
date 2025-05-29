import {computed, Injectable, signal} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Credentials} from '../../models/auth/credentials';
import {catchError, lastValueFrom, Observable, of, tap, throwError,} from 'rxjs';
import {ResponseUtils} from '../../utils/response.utils';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private tokenSignal = signal<string | null>(null);
  private errorSignal = signal<string | null>(null);

  token = computed(() => this.tokenSignal());
  error = computed(() => this.errorSignal());

  constructor(private http: HttpClient) {
  }

  async login(credentials: Credentials) {
    const request = this.http.post<{ token: string }>("http://localhost:3000/auth/login", credentials)
      .pipe(
        tap(response => {
          this.tokenSignal.set(response.token);
          this.errorSignal.set(null);
        }),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleLoginError(error)
          this.tokenSignal.set(null);
          this.errorSignal.set(errorMessage);
          return throwError(() => error);
        })
      );

    return ResponseUtils.didRequestCompleteSuccessfully(request);
  }

  logout() {
    this.tokenSignal.set(null);
  }

  async register(credentials: Credentials) {
    const request = this.http.post<number>("http://localhost:3000/auth/register", credentials)
      .pipe(
        tap(() => {
          this.errorSignal.set(null);
        }),
        catchError((error: HttpErrorResponse) => {
          const errorMessage = this.handleRegisterError(error)
          this.errorSignal.set(errorMessage);
          return throwError(() => error);
        })
      );

    return ResponseUtils.didRequestCompleteSuccessfully(request);
  }

  private handleLoginError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return 'A network error occurred. Please try again.';
    }

    if (error.status === 401 || error.status === 400) {
      return 'Invalid credentials. Please try again.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    return `Login failed (Error ${error.status})`;
  }

  private handleRegisterError(error: HttpErrorResponse): string {
    if (error.error instanceof ErrorEvent) {
      return 'A network error occurred. Please try again.';
    }

    if (error.status === 400) {
      return 'Invalid credentials. Please try again.';
    }

    if (error.status === 409) {
      return 'User already exists. Please try again.';
    }

    if (error.status === 500) {
      return 'Server error. Please try again later.';
    }

    return `Register failed (Error ${error.status})`;
  }
}
