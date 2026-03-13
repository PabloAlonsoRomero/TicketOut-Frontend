import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../../features/auth/services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  
  const user = authService.getUser();
  const expectedRole = route.data['role'];

  console.log('RoleGuard: Checking user role:', user?.role, 'vs expected:', expectedRole);

  if (user) {
    if (Array.isArray(expectedRole)) {
      if (expectedRole.includes(user.role)) return true;
    } else {
      if (user.role === expectedRole) return true;
    }
  }

  // Si no tiene permiso, mandarlo al dashboard
  alert('Acceso restringido: No tienes los permisos necesarios para esta sección.');
  router.navigate(['/dashboard']);
  return false;
};
