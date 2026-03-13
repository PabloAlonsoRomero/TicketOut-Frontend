import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-create',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-create.component.html',
  styleUrl: './user-create.component.css'
})
export class UserCreateComponent {
  private userService = inject(UserService);
  private router = inject(Router);

  user = {
    name: '',
    username: '',
    email: '',
    password: '',
    role: 'USER'
  };

  roles = ['USER', 'ADMIN', 'SUPERUSER'];
  roleLabels: any = {
    'USER': 'Usuario Estándar',
    'ADMIN': 'Administrador',
    'SUPERUSER': 'Superusuario'
  };

  showPassword = false;
  submitting = false;

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  onSubmit() {
    if (this.submitting) return;
    this.submitting = true;

    this.userService.createUser(this.user).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error al crear usuario:', err);
        this.submitting = false;
        alert('Error al crear usuario: ' + (err.error?.error || err.message));
      }
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
