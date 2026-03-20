import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';
import { TicketService } from '../tickets/services/ticket.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  public authService = inject(AuthService);
  public ticketService = inject(TicketService);
  public router = inject(Router);
  public cdr = inject(ChangeDetectorRef);

  userName: string = 'Usuario';
  userRole: string = 'Admin';

  statsCards: any[] = [
    { label: 'Total de tickets', value: '...', icon: 'bi-ticket-perforated', color: 'primary' },
    { label: 'Tickets abiertos', value: '...', icon: 'bi-envelope-open', color: 'danger' },
    { label: 'Tickets resueltos', value: '...', icon: 'bi-check2-circle', color: 'success' },
    { label: 'Tiempo promedio', value: 'Prox.', icon: 'bi-clock-history', color: 'warning' }
  ];

  recentTickets: any[] = [];

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
    console.log('Dashboard: User data from storage:', user);
    if (user) {
      if (user.role === 'USER') {
        this.router.navigate(['/tickets']);
        return;
      }
      this.userName = user.name || user.username || user.email || 'Usuario';
      this.userRole = user.role || 'Admin';
      this.loadDashboardData();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadDashboardData() {
    console.log('Cargando datos del dashboard...');
    this.ticketService.getStats().subscribe({
      next: (response) => {
        console.log('Dashboard Stats Respuesta:', response);
        const stats = response.data;
        if (stats) {
          // Formatear el tiempo promedio
          let avgTimeStr = '0m';
          const avgMinutes = stats.avgResolutionTimeMinutes || 0;
          
          if (avgMinutes < 60) {
            avgTimeStr = `${avgMinutes}m`;
          } else {
            const hours = Math.floor(avgMinutes / 60);
            const mins = avgMinutes % 60;
            avgTimeStr = `${hours}h ${mins}m`;
          }

          this.statsCards = [
            { label: 'Total de tickets', value: stats.total.toString(), icon: 'bi-ticket-perforated', color: 'primary' },
            { label: 'Tickets abiertos', value: stats.open.toString(), icon: 'bi-envelope-open', color: 'danger' },
            { label: 'Tickets resueltos', value: stats.resolved.toString(), icon: 'bi-check2-circle', color: 'success' },
            { label: 'Tiempo promedio', value: avgTimeStr, icon: 'bi-clock-history', color: 'warning' }
          ];
          this.cdr.detectChanges();
        }
      },
      error: (err) => console.error('Error stats:', err)
    });

    this.ticketService.getTickets().subscribe({
      next: (response) => {
        console.log('Dashboard Tickets Respuesta:', response);
        // El backend ya los devuelve ordenados por fecha descendente
        this.recentTickets = (response.data || []).slice(0, 5);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error tickets:', err)
    });
  }

  viewTicket(id: number) {
    this.router.navigate(['/tickets', id]);
  }

  editTicket(id: number) {
    this.router.navigate(['/tickets', id, 'edit']);
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
