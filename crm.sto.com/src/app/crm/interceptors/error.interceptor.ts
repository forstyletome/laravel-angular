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

      const errors = {
        data: error.error.data,
        messages: error.error.messages,
        status: error.error.status,
        success: error.error.success,
        type: error.error.type
      };

      if(!error.error.data.HIDE_SYSTEM_ERROR){

        errorService.setErrors(errors, errors.type);

      }

      return throwError((): HttpErrorResponse => error);

    })

  );

}
