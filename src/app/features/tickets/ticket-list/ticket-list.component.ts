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
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || user.email || 'Usuario';
      this.userRole = user.role || 'USER';
      this.loadTickets(user.role === 'USER');
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadTickets(mine: boolean = false) {
    this.ticketService.getTickets(mine).subscribe({
      next: (response) => {
        // El backend devuelve un objeto { success: true, data: [...], pagination: {...} }
        this.tickets = response.data || [];
        this.applyFilters();
        this.cdr.detectChanges();
        console.log('Tickets cargados:', this.tickets);
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
