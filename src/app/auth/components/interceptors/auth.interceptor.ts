import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();

  req = req.clone({
    withCredentials: true,  // ← agregar esto
    setHeaders: token ? { Authorization: `Bearer ${token}` } : {}
  });

  return next(req);
};