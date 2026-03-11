import { Component, inject, OnInit } from '@angular/core';
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

  ticket: Ticket | null = null;
  loading = true;

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
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // TODO: restaurar cuando haya backend
      // this.loadTicket(id);

      // Datos temporales para pruebas visuales
      this.ticket = {
        id: Number(id),
        title: 'No puedo acceder al sistema de correo',
        description: 'Desde ayer no puedo iniciar sesión en el correo corporativo. He intentado restablecer la contraseña pero el enlace no llega.',
        status: TicketStatus.OPEN,
        priority: TicketPriority.HIGH,
        category: 'Soporte Técnico',
        createdBy: { id: 1, username: 'jframe', email: 'john@test.com', name: 'John Frame', role: 'USER' as any, isActive: true, createdAt: '', updatedAt: '' },
        assignedTo: null,
        createdAt: '2026-03-10T14:30:00Z',
        updatedAt: '2026-03-10T14:30:00Z'
      };
      this.title = this.ticket.title;
      this.description = this.ticket.description;
      this.updateData = {
        status: this.ticket.status,
        priority: this.ticket.priority,
        category: this.ticket.category,
        assignedToId: this.ticket.assignedTo?.id ?? null
      };
      this.loading = false;
    }
  }

  loadTicket(id: string) {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.title = data.title;
        this.description = data.description;
        this.updateData = {
          status: data.status,
          priority: data.priority,
          category: data.category,
          assignedToId: data.assignedTo?.id ?? null
        };
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar ticket:', err);
        this.router.navigate(['/tickets']);
      }
    });
  }

  onSubmit() {
    if (!this.ticket) return;
    this.submitting = true;

    // TODO: restaurar cuando haya backend
    // this.ticketService.updateTicket(this.ticket.id, this.updateData).subscribe({
    //   next: () => {
    //     this.router.navigate(['/tickets', this.ticket!.id]);
    //   },
    //   error: (err) => {
    //     console.error('Error al actualizar ticket:', err);
    //     this.submitting = false;
    //   }
    // });

    // Temporal: simular actualización y redirigir
    setTimeout(() => {
      this.router.navigate(['/tickets']);
    }, 500);
  }

  cancel() {
    this.router.navigate(['/tickets']);
  }
}
