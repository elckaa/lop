import { HttpInterceptorFn } from '@angular/common/http';

// 🔹 Seguro, sin ciclos: toma token directamente de localStorage
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    req = req.clone({
      setHeaders: { Authorization: `Bearer ${token}` }
    });
  }
  return next(req);
};
