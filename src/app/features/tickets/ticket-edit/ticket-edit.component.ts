import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule, ActivatedRoute } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../../auth/services/auth.service';
import { Ticket, UpdateTicketRequest } from '../../../models/ticket-model';
import { TicketPriority, TicketStatus } from '../../../utils/ticket-enums';

@Component({
  selector: 'app-ticket-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-edit.component.html',
  styleUrl: './ticket-edit.component.css'
})
export class TicketEditComponent implements OnInit {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  ticket: Ticket | null = null;
  loading = true;
  userRole: string = 'USER';

  updateData: UpdateTicketRequest = {
    status: undefined,
    priority: undefined,
    category: '',
    assignedToId: null
  };

  // Datos del formulario (título y descripción son de solo lectura o editables)
  title = '';
  description = '';

  statuses = Object.values(TicketStatus);
  priorities = Object.values(TicketPriority);

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

  categories = [
    'Soporte Técnico',
    'Red / Conectividad',
    'Software',
    'Hardware',
    'Accesos / Permisos',
    'Otro'
  ];

  submitting = false;

  ngOnInit() {
    console.log('TicketEditComponent: ngOnInit');
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.role || 'USER';
    }
    const id = this.route.snapshot.paramMap.get('id');
    console.log('TicketEditComponent: ID from route:', id);
    if (id) {
       this.loadTicket(id);
    } else {
       console.error('TicketEditComponent: No ID found in route');
       this.router.navigate(['/tickets']);
    }
  }

  loadTicket(id: string) {
    this.loading = true;
    console.log('TicketEditComponent: Fetching ticket ID:', id);
    
    this.ticketService.getTicketById(id).subscribe({
      next: (response: any) => {
        console.log('TicketEditComponent: Data received:', response);
        // Handle both { success: true, data: {...} } and direct {...}
        const ticketData = response.data || response;
        
        if (ticketData && ticketData.id) {
          this.ticket = ticketData;
          this.title = ticketData.title;
          this.description = ticketData.description;
          this.updateData = {
            status: ticketData.status,
            priority: ticketData.priority,
            category: ticketData.category || '',
            assignedToId: ticketData.assignedTo?.id ?? null
          };
          console.log('TicketEditComponent: Form initialized with:', this.updateData);
        } else {
          console.error('TicketEditComponent: Invalid ticket data structure', ticketData);
          this.router.navigate(['/tickets']);
        }
        this.loading = false;
        this.cdr.detectChanges(); // Force update
      },
      error: (err: any) => {
        console.error('TicketEditComponent: HTTP Error:', err);
        this.loading = false;
        this.router.navigate(['/tickets']);
      }
    });
  }

  onSubmit() {
    if (!this.ticket) return;
    this.submitting = true;

    this.ticketService.updateTicket(this.ticket.id, this.updateData).subscribe({
      next: () => {
        this.router.navigate(['/tickets', this.ticket!.id]);
      },
      error: (err: any) => {
        console.error('Error al actualizar ticket:', err);
        alert(err.error?.error || 'No se pudo actualizar el ticket');
        this.submitting = false;
      }
    });
  }

  cancel() {
    this.router.navigate(['/tickets']);
  }
}
