// Importaciones necesarias de Angular y RxJS
import { Injectable, inject } from '@angular/core'; // Injectable para registrar el servicio, inject para inyección de dependencias
import { HttpClient } from '@angular/common/http'; // Cliente HTTP para hacer peticiones al backend
import { Observable } from 'rxjs'; // Observable para manejar respuestas asíncronas

// Decorador que registra el servicio a nivel raíz (disponible en toda la app)
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // Inyección del cliente HTTP mediante la función inject()
  private http = inject(HttpClient);

  // URL base del backend para las rutas de autenticación
  private apiUrl = 'http://localhost:3000/api/auth';

  // Envía las credenciales (email y password) al endpoint /login del backend
  // Retorna un Observable con la respuesta del servidor
  login(credentials: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, credentials);
  }

  // Guarda el token JWT en localStorage para mantener la sesión activa
  saveToken(token: string) {
    localStorage.setItem('auth_token', token);
  }

  // Guarda el perfil del usuario en localStorage como JSON
  saveUser(user: any) {
    localStorage.setItem('user_profile', JSON.stringify(user));
  }

  // Recupera el perfil del usuario desde localStorage
  // Retorna el objeto usuario o null si no existe
  getUser(): any | null {
    const user = localStorage.getItem('user_profile');
    return user ? JSON.parse(user) : null;
  }

  // Recupera el token JWT desde localStorage
  // Retorna el token como string o null si no existe
  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  // Cierra la sesión eliminando el token y el perfil del usuario de localStorage
  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_profile');
  }
}
