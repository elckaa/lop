import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

const API_URL = 'http://localhost:8080/api';

// 🔹 Interface actualizada según backend
export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  role: string;
  token: string;
  type: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private user: { id: number; username: string; role: string } | null = null;

  constructor(private http: HttpClient) {
    const stored = localStorage.getItem('user');
    if (stored && stored !== 'undefined') {
      try {
        this.user = JSON.parse(stored);
      } catch (e) {
        console.warn('localStorage "user" corrupted, resetting.');
        this.user = null;
        localStorage.removeItem('user');
      }
    }
  }

  login(credentials: { username: string; password: string }): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${API_URL}/auth/login`, credentials).pipe(
      tap(response => {
        // Guardamos solo lo necesario para Angular
        localStorage.setItem('auth_token', response.token);
        localStorage.setItem('user', JSON.stringify({
          id: response.id,
          username: response.username,
          role: response.role
        }));
        this.user = {
          id: response.id,
          username: response.username,
          role: response.role
        };
      })
    );
  }

  getUser(): { id: number; username: string; role: string } | null {
    return this.user;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout(): void {
    localStorage.clear();
    this.user = null;
  }
}
