import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../../auth/services/auth.service';
import { CreateTicketRequest } from '../../../models/ticket-model';
import { TicketPriority } from '../../../utils/ticket-enums';

@Component({
  selector: 'app-ticket-create',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-create.component.html',
  styleUrl: './ticket-create.component.css'
})
export class TicketCreateComponent {
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private router = inject(Router);

  ticket: CreateTicketRequest = {
    title: '',
    description: '',
    priority: TicketPriority.MEDIUM,
    category: ''
  };

  priorities = Object.values(TicketPriority);

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

  onSubmit() {
    if (!this.ticket.title.trim() || !this.ticket.description.trim()) return;

    this.submitting = true;

    // TODO: restaurar cuando haya backend
    // this.ticketService.createTicket(this.ticket).subscribe({
    //   next: () => {
    //     this.router.navigate(['/tickets']);
    //   },
    //   error: (err) => {
    //     console.error('Error al crear ticket:', err);
    //     this.submitting = false;
    //   }
    // });

    // Temporal: simular creación y redirigir
    setTimeout(() => {
      this.router.navigate(['/tickets']);
    }, 500);
  }

  cancel() {
    this.router.navigate(['/tickets']);
  }
}
