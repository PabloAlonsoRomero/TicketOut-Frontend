import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../../auth/services/auth.service';
import { Ticket } from '../../../models/ticket-model';
import { TicketStatus, TicketPriority } from '../../../utils/ticket-enums';

@Component({
  selector: 'app-ticket-list',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './ticket-list.component.html',
  styleUrl: './ticket-list.component.css'
})
export class TicketListComponent implements OnInit {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  tickets: Ticket[] = [];
  filteredTickets: Ticket[] = [];
  userName = 'Usuario';
  userRole = 'Ticket System';
  searchQuery = '';

  // Filtros activos
  statusFilter: TicketStatus | '' = '';
  priorityFilter: TicketPriority | '' = '';

  // Enums para los dropdowns
  statuses = Object.values(TicketStatus);
  priorities = Object.values(TicketPriority);

  // Labels legibles
  statusLabels: Record<string, string> = {
    OPEN: 'Abierto',
    IN_PROGRESS: 'En progreso',
    WAITING_USER: 'Esperando usuario',
    RESOLVED: 'Resuelto',
    CLOSED: 'Cerrado'
  };

  priorityLabels: Record<string, string> = {
    LOW: 'Baja',
    MEDIUM: 'Media',
    HIGH: 'Alta',
    URGENT: 'Urgente'
  };

  ngOnInit() {
    // TODO: restaurar cuando haya backend
    // const user = this.authService.getUser();
    // if (user) {
    //   this.userName = user.name || user.username || 'Usuario';
    //   this.userRole = user.role || 'USER';
    //   this.loadTickets();
    // } else {
    //   this.router.navigate(['/login']);
    // }

    // Datos temporales para pruebas visuales
    this.userName = 'Usuario Prueba';
    this.userRole = 'ADMIN';

    const mockUser = { id: 1, username: 'jframe', email: 'john@test.com', name: 'John Frame', role: 'USER' as any, isActive: true, createdAt: '', updatedAt: '' };
    const mockAdmin = { id: 2, username: 'alopez', email: 'ana@test.com', name: 'Ana López', role: 'ADMIN' as any, isActive: true, createdAt: '', updatedAt: '' };

    this.tickets = [
      { id: 1, title: 'No puedo acceder al correo corporativo', description: 'Desde ayer no puedo iniciar sesión.', status: TicketStatus.OPEN, priority: TicketPriority.HIGH, category: 'Soporte Técnico', createdBy: mockUser, assignedTo: null, createdAt: '2026-03-10T14:30:00Z', updatedAt: '2026-03-10T14:30:00Z' },
      { id: 2, title: 'Instalar Visual Studio Code en equipo nuevo', description: 'Se requiere instalación de IDE.', status: TicketStatus.IN_PROGRESS, priority: TicketPriority.MEDIUM, category: 'Software', createdBy: mockUser, assignedTo: mockAdmin, createdAt: '2026-03-09T10:00:00Z', updatedAt: '2026-03-10T09:15:00Z' },
      { id: 3, title: 'Falla en la red del piso 3', description: 'Conexión intermitente en el área de desarrollo.', status: TicketStatus.OPEN, priority: TicketPriority.URGENT, category: 'Red / Conectividad', createdBy: mockAdmin, assignedTo: null, createdAt: '2026-03-11T08:00:00Z', updatedAt: '2026-03-11T08:00:00Z' },
      { id: 4, title: 'Solicitud de permisos para repositorio Git', description: 'Necesito acceso de escritura al repo backend.', status: TicketStatus.WAITING_USER, priority: TicketPriority.LOW, category: 'Accesos / Permisos', createdBy: mockUser, assignedTo: mockAdmin, createdAt: '2026-03-08T16:45:00Z', updatedAt: '2026-03-09T11:20:00Z' },
      { id: 5, title: 'Monitor no enciende', description: 'El monitor Dell del puesto 12 no da señal.', status: TicketStatus.RESOLVED, priority: TicketPriority.MEDIUM, category: 'Hardware', createdBy: mockUser, assignedTo: mockAdmin, createdAt: '2026-03-07T09:30:00Z', updatedAt: '2026-03-10T17:00:00Z' },
      { id: 6, title: 'Actualización de Windows bloqueada', description: 'La actualización KB5034441 falla con error 0x80070643.', status: TicketStatus.CLOSED, priority: TicketPriority.LOW, category: 'Software', createdBy: mockAdmin, assignedTo: mockAdmin, createdAt: '2026-03-05T13:00:00Z', updatedAt: '2026-03-06T10:00:00Z', closedAt: '2026-03-06T10:00:00Z' },
    ];
    this.applyFilters();
  }

  loadTickets() {
    this.ticketService.getTickets().subscribe({
      next: (data) => {
        this.tickets = data;
        this.applyFilters();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar tickets:', err);
        if (err.status === 403) {
          alert('No tienes permisos para acceder a los tickets.');
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  applyFilters() {
    let result = [...this.tickets];

    if (this.searchQuery.trim()) {
      const query = this.searchQuery.toLowerCase();
      result = result.filter(t =>
        t.title.toLowerCase().includes(query) ||
        t.description?.toLowerCase().includes(query) ||
        t.category?.toLowerCase().includes(query)
      );
    }

    if (this.statusFilter) {
      result = result.filter(t => t.status === this.statusFilter);
    }

    if (this.priorityFilter) {
      result = result.filter(t => t.priority === this.priorityFilter);
    }

    this.filteredTickets = result;
  }

  clearFilters() {
    this.searchQuery = '';
    this.statusFilter = '';
    this.priorityFilter = '';
    this.applyFilters();
  }

  viewTicket(ticket: Ticket) {
    this.router.navigate(['/tickets', ticket.id]);
  }

  editTicket(ticket: Ticket) {
    this.router.navigate(['/tickets', ticket.id, 'edit']);
  }

  createTicket() {
    this.router.navigate(['/tickets/create']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
