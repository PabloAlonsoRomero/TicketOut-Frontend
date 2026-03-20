import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';
import { TicketService } from '../../../features/tickets/services/ticket.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private cdr = inject(ChangeDetectorRef);

  userName: string = 'Usuario';
  userRole: string = 'Admin';

  menuItems = [
    {
      label: 'Dashboard',
      icon: 'bi-grid-1x2-fill',
      route: '/dashboard',
      badge: null as string | null,
      disabled: false
    },
    {
      label: 'Tickets',
      icon: 'bi-ticket-perforated',
      route: '/tickets',
      badge: null as string | null,
      disabled: false
    },
    {
      label: 'Usuarios',
      icon: 'bi-people',
      route: '/users',
      badge: null as string | null,
      disabled: false
    },
    {
      label: 'Registro de Logs',
      icon: 'bi-journal-text',
      route: '/logs',
      badge: null as string | null,
      disabled: false
    }
  ];

  ngOnInit() {
    const user = this.authService.getUser();
    console.log('Usuario en Sidebar:', user);
    if (user) {
      this.userName = user.name || user.username || user.email || 'Usuario';
      this.userRole = user.role || 'Admin';

      // Filter based on role
      if (this.userRole === 'USER') {
        // Users only see Tickets
        this.menuItems = this.menuItems.filter(item => 
          item.label === 'Tickets'
        );
      } else if (this.userRole === 'ADMIN') {
        // Admins see everything except Usuarios
        this.menuItems = this.menuItems.filter(item => 
          item.label !== 'Usuarios'
        );
      }
      // SUPERUSER sees everything (no filter needed)

      this.ticketService.getTickets(this.userRole === 'USER').subscribe({
        next: (response: any) => {
          const ticketsItem = this.menuItems.find(item => item.label === 'Tickets');
          if (ticketsItem) {
            ticketsItem.badge = response.pagination?.total?.toString() || response.data?.length?.toString() || '0';
            this.cdr.detectChanges();
          }
        }
      });
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
