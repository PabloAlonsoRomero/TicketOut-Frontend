import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  // URL base del backend que configuramos
  private apiUrl = 'http://localhost:3000/api/auth';

  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Guardar el token en localStorage para futuras peticiones
  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  saveUser(user: any) {
    localStorage.setItem('user_profile', JSON.stringify(user));
  }

  getUser(): any | null {
    const user = localStorage.getItem('user_profile');
    return user ? JSON.parse(user) : null;
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
  }
}
