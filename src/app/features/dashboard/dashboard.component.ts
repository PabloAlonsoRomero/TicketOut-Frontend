import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../auth/services/auth.service';

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

  userName: string = 'John Frame';
  userRole: string = 'Ticket System';

  tickets = [
    { id: '11A73E1', subject: 'Shot trucketed xra bcproblems', requester: 'Requer Smith', status: 'Open', priority: 'High', created: 'Today at 8:00 PM', assignee: 'Darly Man' },
    { id: '11A73E2', subject: 'Adurt imachment', requester: 'Arimew Kamnson', status: 'In Progress', priority: 'Medium', created: 'Today at 3:00 PM', assignee: 'Rethr Smith' },
    { id: '11A73E3', subject: 'Meet fluat connection', requester: 'Anrnew Molte', status: 'Resolved', priority: 'Low', created: 'Today at 7:30 PM', assignee: 'Jona ulon' },
    { id: '11A73E4', subject: 'Resolved noe commtion', requester: 'Farter Smith', status: 'Resolved', priority: 'High', created: 'Today at 7:30 PM', assignee: 'Chria Mann' },
    { id: '11A73E5', subject: 'Block board UK compañios', requester: 'Farter Smith', status: 'In Progress', priority: 'Medium', created: 'Today at 8:30 PM', assignee: 'Rign Zanh' },
  ];

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || user.username || 'Usuario';
      this.userRole = user.role || 'Admin';
    } else {
        // Si no hay usuario, redirigir al login (opcional pero recomendado)
        // this.router.navigate(['/login']);
    }
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
