import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../features/auth/services/auth.service';

@Component({
  selector: 'app-topbar',
  imports: [CommonModule],
  templateUrl: './topbar.html',
  styleUrl: './topbar.css',
})
export class Topbar implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  userName: string = 'Usuario';

  ngOnInit() {
    const user = this.authService.getUser();
    if (user) {
      this.userName = user.name || user.email || 'Usuario';
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
