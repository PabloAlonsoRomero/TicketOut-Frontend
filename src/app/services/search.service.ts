import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../features/auth/services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private apiUrl = 'http://localhost:3000/api/search';

  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  globalSearch(query: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}?q=${encodeURIComponent(query)}`, { 
      headers: this.getHeaders() 
    });
  }
}
