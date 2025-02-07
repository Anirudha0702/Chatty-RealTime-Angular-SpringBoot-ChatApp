import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly API_URL = 'http://localhost:8082/api/auth';

  constructor(private http: HttpClient) {}

  register(userData: { username: string, email: string, password: string }) {
    return this.http.post(`${this.API_URL}/register`, userData, { observe: 'response' })
      .pipe(
        catchError(err => {
          throw new Error(err.error?.error || 'Registration failed');
        })
      );
  }

  login(username: string, password: string) {
    return this.http.post<{ access_token: string, user: User }>(`${this.API_URL}/login`, { username, password })
      .pipe(
        tap(res => {
          localStorage.setItem('access_token', res.access_token);
          localStorage.setItem('user', JSON.stringify(res.user));
        }),
        catchError(err => {
          throw new Error(err.error?.error || 'Login failed');
        })
      );
  }

  getCurrentUser(): User | null {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
}
