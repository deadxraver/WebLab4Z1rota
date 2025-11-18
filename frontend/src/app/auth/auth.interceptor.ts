import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from './auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);


  const token = localStorage.getItem('authToken');

  let newReq = req;
  if (token) {
    newReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }


  return next(newReq).pipe(
    catchError((error: HttpErrorResponse) => {
      
     
      if (error.status === 401) {
       
        

        authService.logout(); 
        
      
        router.navigate(['/login'], {
            queryParams: { sessionExpired: 'true' } 
        });
      }

    
      return throwError(() => error);
    })
  );
};