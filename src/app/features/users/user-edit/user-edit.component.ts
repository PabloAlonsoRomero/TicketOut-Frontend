import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-user-edit',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './user-edit.component.html',
  styleUrl: './user-edit.component.css' // We can reuse create styles or have its own
})
export class UserEditComponent implements OnInit {
  private userService = inject(UserService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  userId: number = 0;
  loading = true;
  submitting = false;

  user: any = {
    name: '',
    username: '',
    email: '',
    role: '',
    isActive: true,
    password: '' // Optional for edit
  };

  roles = ['USER', 'ADMIN', 'SUPERUSER'];
  roleLabels: any = {
    'USER': 'Usuario Estándar',
    'ADMIN': 'Administrador',
    'SUPERUSER': 'Superusuario'
  };

  showPassword = false;
  ngOnInit() {
    this.userId = Number(this.route.snapshot.paramMap.get('id'));
    if (this.userId) {
      this.loadUser();
    } else {
      this.router.navigate(['/users']);
    }
  }

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  loadUser() {
    this.userService.getUserById(this.userId).subscribe({
      next: (response: any) => {
        console.log('[UserEdit] User loaded successfully:', response.data);
        this.user = { ...response.data, password: '' };
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuario:', err);
        alert('No se pudo cargar la información del usuario.');
        this.router.navigate(['/users']);
      }
    });
  }

  onSubmit() {
    if (this.submitting) return;
    this.submitting = true;

    // Prepare data (only send password if not empty)
    const updateData: any = {
      name: this.user.name,
      username: this.user.username,
      email: this.user.email,
      role: this.user.role,
      isActive: this.user.isActive
    };

    if (this.user.password && this.user.password.trim() !== '') {
      updateData.password = this.user.password;
    }

    this.userService.updateUser(this.userId, updateData).subscribe({
      next: () => {
        this.router.navigate(['/users']);
      },
      error: (err) => {
        console.error('Error al actualizar usuario:', err);
        this.submitting = false;
        alert('Error al actualizar usuario: ' + (err.error?.error || err.message));
      }
    });
  }

  cancel() {
    this.router.navigate(['/users']);
  }
}
