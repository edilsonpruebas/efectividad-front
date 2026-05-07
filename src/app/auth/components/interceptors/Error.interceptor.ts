import { HttpInterceptorFn, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { NotificationService } from '../../services/notification.service';
import { tap, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notificationService = inject(NotificationService);

  return next(req).pipe(
    tap(event => {
      // Soporta tanto HttpResponse de Angular
      if (event instanceof HttpResponse) {
        const status = event.status;
        if (status >= 200 && status < 300 && (event.body as any)?.message) {
          notificationService.success((event.body as any).message);
        }
      }
    }),
    catchError((error: HttpErrorResponse) => {
      let errorMessage = 'Error desconocido';

      if ((error.error as any)?.error) {
        errorMessage = (error.error as any).error;
      } else if ((error.error as any)?.message) {
        errorMessage = (error.error as any).message;
      } else if (error.statusText) {
        errorMessage = error.statusText;
      }

      console.log('INTERCEPTOR CATCH', { status: error.status, errorMessage, error });

      if (error.status === 0) {
        notificationService.error('❌ Error de conexión con el servidor');
      } else if (error.status === 400) {
        notificationService.warning('⚠️ ' + errorMessage);
      } else if (error.status === 401) {
        notificationService.error('❌ No autorizado. Por favor inicia sesión.');
      } else if (error.status === 403) {
        notificationService.error('❌ No tienes permiso para realizar esta acción');
      } else if (error.status === 404) {
        notificationService.error('❌ Recurso no encontrado');
      } else if (error.status === 422) {
        notificationService.warning('⚠️ ' + errorMessage);
      } else if (error.status >= 500) {
        notificationService.error('❌ Error en el servidor. Intenta nuevamente.');
      } else {
        notificationService.error('❌ ' + errorMessage);
      }

      return throwError(() => error);
    })
  );
};