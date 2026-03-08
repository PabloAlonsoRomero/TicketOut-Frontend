import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string = 'Usuario';
  userRole: string = 'Admin';

  menuItems = [
    {
      label: 'Panel',
      icon: 'bi-grid-1x2-fill',
      route: '/dashboard',
      badge: null
    },
    {
      label: 'Incidencias',
      icon: 'bi-ticket-perforated',
      route: '/tickets',
      badge: '12'
    },
    {
      label: 'Usuarios',
      icon: 'bi-people',
      route: '/users',
      badge: null
    },
    {
      label: 'Reportes',
      icon: 'bi-bar-chart-line',
      route: '/reports',
      badge: null
    },
    {
      label: 'Ajustes',
      icon: 'bi-gear',
      route: '/settings',
      badge: null
    }
  ];

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || user.email || 'Usuario';
      this.userRole = user.role || 'Admin';
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
