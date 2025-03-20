import {HttpInterceptorFn} from '@angular/common/http';
import { HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {ErrorService} from '../services/errors/error.service';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {

  const errorService:ErrorService = inject(ErrorService);

  return next(req).pipe(

    catchError((error: HttpErrorResponse) => {

      console.log(error);

      const errors = {
        data: error.error.errors.data,
        messages: error.error.errors.messages,
        type: error.error.errors.type,
        status: error.status
      };

      errorService.setErrors(errors, error.error.errors.type);

      return throwError(() => '');

    })

  );

}
