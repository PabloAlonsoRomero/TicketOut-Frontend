import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TicketService } from '../../tickets/services/ticket.service';

@Component({
  selector: 'app-log-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './log-table.component.html',
  styleUrl: './log-table.component.css'
})
export class LogTableComponent implements OnInit {
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);
  
  logs: any[] = [];
  loading = true;

  ngOnInit() {
    this.loadLogs();
  }

  loadLogs() {
    this.loading = true;
    this.ticketService.getLogs().subscribe({
      next: (response) => {
        this.logs = response.data || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error cargando logs:', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  formatEvent(log: any): string {
    const type = log.type;
    const payload = log.payloadJson;

    switch (type) {
      case 'TICKET_CREATED': return 'Ticket creado';
      case 'STATUS_CHANGED': return `Estado: ${payload.before} → ${payload.after}`;
      case 'PRIORITY_CHANGED': return `Prioridad: ${payload.before} → ${payload.after}`;
      case 'CATEGORY_CHANGED': return `Categoría: ${payload.before} → ${payload.after}`;
      case 'ASSIGNED': return 'Ticket asignado';
      case 'COMMENT_ADDED': return payload.isInternal ? 'Nota interna agregada' : 'Comentario agregado';
      case 'TICKET_CLOSED': return 'Ticket cerrado';
      default: return type;
    }
  }
}
