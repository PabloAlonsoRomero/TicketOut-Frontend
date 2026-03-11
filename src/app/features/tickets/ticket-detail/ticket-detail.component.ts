import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../../auth/services/auth.service';
import { Ticket } from '../../../models/ticket-model';
import { Comment } from '../../../models/commet-model';
import { TicketEvent } from '../../../models/event-model';
import { TicketStatus, TicketPriority, EventType } from '../../../utils/ticket-enums';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);

  ticket: Ticket | null = null;
  comments: Comment[] = [];
  events: TicketEvent[] = [];
  loading = true;

  newComment = '';
  isInternalNote = false;
  submittingComment = false;

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

  eventTypeLabels: Record<string, string> = {
    TICKET_CREATED: 'Ticket creado',
    STATUS_CHANGED: 'Estado cambiado',
    PRIORITY_CHANGED: 'Prioridad cambiada',
    CATEGORY_CHANGED: 'Categoría cambiada',
    ASSIGNED: 'Ticket asignado',
    COMMENT_ADDED: 'Comentario añadido',
    TICKET_CLOSED: 'Ticket cerrado'
  };

  eventTypeIcons: Record<string, string> = {
    TICKET_CREATED: 'bi-plus-circle-fill',
    STATUS_CHANGED: 'bi-arrow-repeat',
    PRIORITY_CHANGED: 'bi-exclamation-triangle-fill',
    CATEGORY_CHANGED: 'bi-tag-fill',
    ASSIGNED: 'bi-person-check-fill',
    COMMENT_ADDED: 'bi-chat-dots-fill',
    TICKET_CLOSED: 'bi-check-circle-fill'
  };

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // TODO: restaurar cuando haya backend
      // this.loadTicket(id);

      const mockUser = { id: 1, username: 'jframe', email: 'john@test.com', name: 'John Frame', role: 'USER' as any, isActive: true, createdAt: '', updatedAt: '' };
      const mockAdmin = { id: 2, username: 'alopez', email: 'ana@test.com', name: 'Ana López', role: 'ADMIN' as any, isActive: true, createdAt: '', updatedAt: '' };

      this.ticket = {
        id: Number(id),
        title: 'No puedo acceder al sistema de correo corporativo',
        description: 'Desde ayer por la tarde no puedo iniciar sesión en el correo corporativo (Outlook Web). He intentado restablecer la contraseña desde el portal de autoservicio, pero el enlace de restablecimiento nunca llega a mi correo personal.\n\nPasos que he intentado:\n1. Limpiar caché del navegador\n2. Probar en modo incógnito\n3. Usar otro navegador (Chrome y Firefox)\n4. Solicitar restablecimiento de contraseña\n\nEl error que aparece es: "Las credenciales proporcionadas no son válidas. Contacte al administrador."',
        status: TicketStatus.IN_PROGRESS,
        priority: TicketPriority.HIGH,
        category: 'Soporte Técnico',
        createdBy: mockUser,
        assignedTo: mockAdmin,
        createdAt: '2026-03-09T14:30:00Z',
        updatedAt: '2026-03-11T09:15:00Z'
      };

      this.comments = [
        { id: 1, body: 'He revisado tu cuenta en el Active Directory y veo que fue bloqueada por múltiples intentos fallidos. Voy a desbloquearla y generar una contraseña temporal.', isInternal: false, author: mockAdmin, createdAt: '2026-03-10T09:00:00Z' },
        { id: 2, body: 'Cuenta desbloqueada. Verificar que el servicio SMTP del servidor de correo está funcionando correctamente, parece que los correos de restablecimiento no se están enviando.', isInternal: true, author: mockAdmin, createdAt: '2026-03-10T09:30:00Z' },
        { id: 3, body: 'Muchas gracias, ya pude ingresar con la contraseña temporal. ¿Puedo cambiarla desde el portal?', isInternal: false, author: mockUser, createdAt: '2026-03-10T11:45:00Z' },
      ];

      this.events = [
        { id: 1, type: EventType.TICKET_CREATED, payloadJson: { details: 'Ticket creado por John Frame' }, actor: mockUser, createdAt: '2026-03-09T14:30:00Z' },
        { id: 2, type: EventType.ASSIGNED, payloadJson: { after: 'Ana López' }, actor: mockAdmin, createdAt: '2026-03-09T15:00:00Z' },
        { id: 3, type: EventType.STATUS_CHANGED, payloadJson: { before: 'Abierto', after: 'En progreso' }, actor: mockAdmin, createdAt: '2026-03-10T09:00:00Z' },
        { id: 4, type: EventType.PRIORITY_CHANGED, payloadJson: { before: 'Media', after: 'Alta' }, actor: mockAdmin, createdAt: '2026-03-10T09:05:00Z' },
        { id: 5, type: EventType.COMMENT_ADDED, payloadJson: { details: 'Comentario añadido' }, actor: mockAdmin, createdAt: '2026-03-10T09:30:00Z' },
      ];

      this.loading = false;
    }
  }

  loadTicket(id: string) {
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        this.loading = false;
      },
      error: (err) => {
        console.error('Error al cargar ticket:', err);
        this.router.navigate(['/tickets']);
      }
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.ticket) return;
    this.submittingComment = true;

    // TODO: restaurar cuando haya backend
    // this.ticketService.addComment(this.ticket.id, { body: this.newComment, isInternal: this.isInternalNote }).subscribe(...)

    // Temporal: agregar comentario localmente
    const mockComment: Comment = {
      id: this.comments.length + 1,
      body: this.newComment,
      isInternal: this.isInternalNote,
      author: { id: 99, username: 'usuario_prueba', email: 'test@test.com', name: 'Usuario Prueba', role: 'ADMIN' as any, isActive: true, createdAt: '', updatedAt: '' },
      createdAt: new Date().toISOString()
    };
    this.comments.push(mockComment);
    this.newComment = '';
    this.isInternalNote = false;
    this.submittingComment = false;
  }

  editTicket() {
    if (this.ticket) {
      this.router.navigate(['/tickets', this.ticket.id, 'edit']);
    }
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}
