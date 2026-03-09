// Importaciones necesarias de Angular y RxJS
import { Injectable, inject } from '@angular/core'; // Injectable para registrar el servicio, inject para inyección de dependencias
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Cliente HTTP y clase para configurar headers
import { Observable } from 'rxjs'; // Observable para manejar respuestas asíncronas
import { AuthService } from '../../auth/services/auth.service'; // Servicio de autenticación para obtener el token

// Decorador que registra el servicio a nivel raíz (disponible en toda la app)
@Injectable({
  providedIn: 'root'
})
export class UserService {
  // Inyección del cliente HTTP para realizar peticiones al backend
  private http = inject(HttpClient);

  // Inyección del servicio de autenticación para acceder al token JWT
  private authService = inject(AuthService);

  // URL base del backend para las rutas de usuarios
  private apiUrl = 'http://localhost:3000/api/users';

  // Construye los headers de autorización con el token JWT del usuario logueado
  // Se usa en cada petición para autenticar al usuario ante el backend
  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  // Obtiene la lista completa de usuarios desde el backend
  // Retorna un Observable con un array de usuarios
  getUsers(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl, { headers: this.getHeaders() });
  }

  // Obtiene un usuario específico por su ID
  // Retorna un Observable con los datos del usuario
  getUserById(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}