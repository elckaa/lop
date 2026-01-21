import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth';

export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  const user = auth.getUser();
  const allowedRoles: string[] = route.data['roles'];

  if (!user || !allowedRoles.includes(user.role)) {
    router.navigate(['/login']);
    return false;
  }

  return true;
};
