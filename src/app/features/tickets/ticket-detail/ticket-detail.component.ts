import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private ticketService = inject(TicketService);
  private authService = inject(AuthService);
  private cdr = inject(ChangeDetectorRef);

  ticket: any = null;
  userName: string = 'Usuario';
  userRole: string = 'Ticket System';

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || user.username || 'Usuario';
      this.userRole = user.role || 'USER';
    }

    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id) {
        this.loadTicket(id);
      }
    });
  }

  loadTicket(id: string) {
    console.log('TicketDetail: Cargando ID:', id);
    this.ticketService.getTicketById(id).subscribe({
      next: (data) => {
        this.ticket = data;
        console.log('TicketDetail: Datos recibidos:', data);
        this.cdr.detectChanges(); // Asegurar renderizado
      },
      error: (err) => {
        console.error('TicketDetail: Error al cargar:', err);
        this.router.navigate(['/dashboard']);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
