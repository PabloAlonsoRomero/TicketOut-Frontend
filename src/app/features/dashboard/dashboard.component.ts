import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string = 'Usuario';
  userRole: string = 'Admin';

  statsCards = [
    { label: 'Total de tickets', value: '154', change: '+12%' },
    { label: 'Tickets abiertos', value: '45', change: '+5%' },
    { label: 'Tickets resueltos', value: '102', change: '+8%' },
    { label: 'Tiempo promedio', value: '2h 15m', change: '-15%' }
  ];

  tickets = [
    {
      id: '11A73E1',
      subject: 'Problema con conexión a base de datos',
      requester: 'Juan Pérez',
      status: 'Abierto',
      priority: 'Alta',
      created: 'Hoy 8:00 PM',
      assignee: 'María García'
    },
    {
      id: '11A73E2',
      subject: 'Error en módulo de autenticación',
      requester: 'Ana López',
      status: 'En progreso',
      priority: 'Media',
      created: 'Hoy 3:00 PM',
      assignee: 'Carlos Rodríguez'
    },
    {
      id: '11A73E3',
      subject: 'Solicitud de nueva funcionalidad',
      requester: 'Pedro Martínez',
      status: 'Resuelto',
      priority: 'Baja',
      created: 'Hoy 7:30 PM',
      assignee: 'Laura Sánchez'
    },
    {
      id: '11A73E4',
      subject: 'Problema de rendimiento en el panel',
      requester: 'Sofia Ramírez',
      status: 'Resuelto',
      priority: 'Alta',
      created: 'Hoy 7:30 PM',
      assignee: 'Diego Torres'
    },
    {
      id: '11A73E5',
      subject: 'Configuración de servidor de correo',
      requester: 'Miguel Herrera',
      status: 'In Progress',
      priority: 'Medium',
      created: 'Hoy 8:30 PM',
      assignee: 'Carmen Flores'
    },
  ];

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.userName = user.name || user.email || 'Usuario';
      this.userRole = user.role || 'Admin';
    } else {
      // Si no hay usuario, redirigir al login
      this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
