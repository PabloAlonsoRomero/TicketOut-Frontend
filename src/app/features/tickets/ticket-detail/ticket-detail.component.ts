import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { UserService } from '../services/user.service';
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
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ticket: Ticket | null = null;
  comments: Comment[] = [];
  events: TicketEvent[] = [];
  loading = true;
  userRole: string = 'USER';
  currentUserId: number | null = null;

  assignableUsers: any[] = [];
  selectedAssigneeId: number | null = null;
  showAssignForm: boolean = false;

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
    const user = this.authService.getUser();
    if (user) {
      this.userRole = user.role || 'USER';
      this.currentUserId = user.id;
      
      if (this.userRole === 'SUPERUSER' || this.userRole === 'ADMIN') {
        this.loadAssignableUsers();
      }
    }
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
       this.loadTicket(id);
    }
  }

  loadTicket(id: string) {
    this.ticketService.getTicketById(id).subscribe({
      next: (response) => {
        // El backend devuelve { success: true, data: { ... } }
        this.ticket = response.data || response;
        this.comments = this.ticket?.comments || [];
        this.events = this.ticket?.events || [];
        this.loading = false;
        this.cdr.detectChanges();
        console.log('Ticket cargado en detalle:', this.ticket);
        console.log('Comentarios:', this.comments);
      },
      error: (err) => {
        console.error('Error al cargar ticket:', err);
        this.loading = false;
        this.router.navigate(['/tickets']);
      }
    });
  }

  addComment() {
    if (!this.newComment.trim() || !this.ticket) return;
    this.submittingComment = true;

    this.ticketService.addComment(this.ticket.id, this.newComment, this.isInternalNote).subscribe({
      next: (response) => {
        // Recargar el ticket completo para actualizar comentarios e historial
        const ticketId = this.ticket?.id.toString();
        if (ticketId) {
          this.loadTicket(ticketId);
        }
        this.newComment = '';
        this.isInternalNote = false;
        this.submittingComment = false;
      },
      error: (err) => {
        console.error('Error al agregar comentario:', err);
        alert(err.error?.error || 'No se pudo agregar el comentario');
        this.submittingComment = false;
      }
    });
  }

  editTicket() {
    if (this.ticket) {
      this.router.navigate(['/tickets', this.ticket.id, 'edit']);
    }
  }

  loadAssignableUsers() {
    this.userService.getAssignableUsers().subscribe({
      next: (response) => {
        this.assignableUsers = response.data || response;
      },
      error: (err) => console.error('Error al cargar usuarios asignables:', err)
    });
  }

  claimTicket() {
    if (!this.currentUserId) return;
    this.assignTicket(this.currentUserId);
  }

  assignTicket(userId?: number) {
    const rawUserId = userId || this.selectedAssigneeId;
    if (!rawUserId || !this.ticket) return;

    const targetUserId = Number(rawUserId);

    this.ticketService.assignTicket(this.ticket.id, targetUserId).subscribe({
      next: (response) => {
        const ticketId = this.ticket?.id.toString();
        if (ticketId) {
          this.loadTicket(ticketId);
        }
        this.selectedAssigneeId = null;
        this.showAssignForm = false;
      },
      error: (err) => {
        console.error('Error al asignar ticket:', err);
        alert(err.error?.error || 'No se pudo asignar el ticket');
      }
    });
  }

  goBack() {
    this.router.navigate(['/tickets']);
  }
}
