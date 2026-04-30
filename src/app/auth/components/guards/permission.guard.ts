import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';


export const permissionGuard = (permission: string): CanActivateFn => () => {
  const auth   = inject(AuthService);
  const router = inject(Router);

  if (auth.can(permission)) return true;

  if (auth.isLoggedIn()) { router.navigate(['/']); return false; }

  router.navigate(['/login']);
  return false;
};