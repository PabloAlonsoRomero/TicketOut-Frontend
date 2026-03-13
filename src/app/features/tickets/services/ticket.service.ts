// Importaciones necesarias de Angular y RxJS
import { Injectable, inject } from '@angular/core'; // Injectable para registrar el servicio, inject para inyección de dependencias
import { HttpClient, HttpHeaders } from '@angular/common/http'; // Cliente HTTP y clase para configurar headers
import { Observable } from 'rxjs'; // Observable para manejar respuestas asíncronas
import { AuthService } from '../../auth/services/auth.service'; // Servicio de autenticación para obtener el token

// Decorador que registra el servicio a nivel raíz (disponible en toda la app)
@Injectable({
  providedIn: 'root'
})
export class TicketService {
  // Inyección del cliente HTTP para realizar peticiones al backend
  private http = inject(HttpClient);

  // Inyección del servicio de autenticación para acceder al token JWT
  private authService = inject(AuthService);

  // URL base del backend para las rutas de tickets
  private apiUrl = 'http://localhost:3000/api/tickets';

  // Construye los headers de autorización con el token JWT del usuario logueado
  // Se usa en cada petición para autenticar al usuario ante el backend
  private getHeaders() {
    const token = this.authService.getToken();
    return new HttpHeaders({
      'Authorization': `Bearer ${token}`
    });
  }

  getTickets(mine: boolean = false): Observable<any> {
    const url = mine ? `${this.apiUrl}?mine=true` : this.apiUrl;
    return this.http.get<any>(url, { headers: this.getHeaders() });
  }

  // Obtiene un ticket específico por su ID
  // Elimina el prefijo 'TKT-' del ID antes de enviarlo al backend
  // Retorna un Observable con los datos del ticket
  getTicketById(id: string): Observable<any> {
    const numericId = id.replace('TKT-', '');
    return this.http.get<any>(`${this.apiUrl}/${numericId}`, { headers: this.getHeaders() });
  }

  // Obtiene las estadísticas generales de tickets (totales, abiertos, resueltos, etc.)
  // Retorna un Observable con el objeto de estadísticas
  getStats(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/stats`, { headers: this.getHeaders() });
  }

  // Agrega un comentario a un ticket
  addComment(ticketId: number, body: string, isInternal: boolean = false): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/${ticketId}/comments`, 
      { body, isInternal }, 
      { headers: this.getHeaders() }
    );
  }

  // Crea un nuevo ticket
  createTicket(ticket: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, ticket, { headers: this.getHeaders() });
  }

  // Asigna un ticket a un usuario específico
  assignTicket(ticketId: number, assignedToId: number): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/${ticketId}/assign`, 
      { assignedToId }, 
      { headers: this.getHeaders() }
    );
  }

  // Actualiza un ticket existente
  updateTicket(ticketId: number, data: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${ticketId}`, data, { headers: this.getHeaders() });
  }
}