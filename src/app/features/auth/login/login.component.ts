import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  loginData = {
    email: '',
    password: '',
    rememberMe: false
  };

  onSubmit() {
    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        // Guardamos el token y perfil
        if (response.token) {
          this.authService.saveToken(response.token);
          this.authService.saveUser(response.user);
        }

        // Redirigimos al dashboard (sin alerta)
        this.router.navigate(['/dashboard']);
        console.log('Login success:', response);
      },
      error: (err) => {
        // Alerta de error se mantiene
        alert('Error: Credenciales no válidas. Por favor, verifica tu correo y contraseña.');
        console.error('Login error:', err);
      }
    });
  }
}
