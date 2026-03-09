import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../services/user.service';
import { AuthService } from '../../auth/services/auth.service';

@Component({
  selector: 'app-user-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './user-list.component.html',
  styleUrl: './user-list.component.css'
})
export class UserListComponent implements OnInit {
  private userService = inject(UserService);
  private authService = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  users: any[] = [];
  userName: string = 'Usuario';
  userRole: string = 'Ticket System';

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || user.username || 'Usuario';
      this.userRole = user.role || 'USER';

      this.loadUsers();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUsers() {
    this.userService.getUsers().subscribe({
      next: (data) => {
        this.users = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
        // Si no tiene permiso, redirigir al dashboard
        if (err.status === 403) {
          alert('No tienes permisos para acceder a la gestión de usuarios.');
          this.router.navigate(['/dashboard']);
        }
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
