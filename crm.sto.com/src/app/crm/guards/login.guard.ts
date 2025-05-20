import { CanActivateFn } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth/auth.service';
import {map, Observable} from 'rxjs';

export const loginGuard: CanActivateFn = (route, state): Observable<boolean> => {

  const authService:AuthService = inject(AuthService);

  return authService.isAuthenticated$.pipe(

    map(authenticated => {

      return !authenticated;

    })

  );

};
